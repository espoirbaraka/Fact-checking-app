import uuid

from app.core.logging import get_logger
from app.repositories.conversation_repository import ConversationRepository
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.common import ClaimSchema
from app.services.confidence_service import ConfidenceService
from app.services.fact_check_service import FactCheckService
from app.services.qwen_service import QwenService
from app.services.rag_service import RAGService
from app.services.source_service import SourceService

logger = get_logger(__name__)


class ChatService:
    def __init__(
        self,
        qwen_service: QwenService,
        fact_check_service: FactCheckService,
        rag_service: RAGService,
        confidence_service: ConfidenceService,
        source_service: SourceService,
        conversation_repository: ConversationRepository | None = None,
    ) -> None:
        self._qwen_service = qwen_service
        self._fact_check_service = fact_check_service
        self._rag_service = rag_service
        self._confidence_service = confidence_service
        self._source_service = source_service
        self._conversation_repository = conversation_repository

    async def process_chat(self, request: ChatRequest) -> ChatResponse:
        conversation_id = await self._resolve_conversation_id(request.conversation_id)
        await self._persist_message(conversation_id, "user", request.message)

        context_documents = await self._rag_service.retrieve_documents(request.message)
        context_block = self._build_context_block(context_documents)

        has_docs = bool(context_documents)
        system_prompt = (
            "Tu es un assistant de fact-checking pour le Nord-Kivu (RD Congo), "
            "zone de conflit armé avec forte désinformation (WhatsApp, radio, rumeurs). "
            "Réponds en français, précis et prudent.\n"
            "Règles:\n"
            "1) Structure: Verdict (vrai / faux / partiellement vrai / non vérifiable), "
            "puis explication courte, puis limites.\n"
            "2) Faits de base à ne pas contredire sans preuve: "
            "Goma = chef-lieu du Nord-Kivu ; Bukavu = chef-lieu du Sud-Kivu.\n"
            "3) Sans documents de référence fournis: ne prétends PAS avoir vérifié "
            "auprès de sources primaires. Dis clairement que c'est une analyse basée "
            "sur connaissances générales et qu'il faut croiser radio communautaire, "
            "ONG, presse et autorités locales. Prefère 'non vérifiable' pour "
            "l'actualité récente (combats, camps, nombres de morts).\n"
            "4) N'invente jamais d'URL, de dates précises ou de citations.\n"
            "5) Indique un niveau de confiance modeste (faible/moyen) si tu n'as pas "
            "de source fournie dans le contexte."
        )
        prompt = request.message
        if context_block:
            prompt = (
                f"Documents de référence (utilise-les en priorité):\n{context_block}\n\n"
                f"Question / affirmation à vérifier:\n{request.message}"
            )
        else:
            prompt = (
                "Aucun document de référence n'est disponible pour cette requête. "
                "Reste prudent et signale l'incertitude.\n\n"
                f"Question / affirmation à vérifier:\n{request.message}"
            )

        # Sequential LLM calls — parallel 7b loads often exhaust local Ollama RAM
        answer = await self._qwen_service.generate_response(
            prompt=prompt,
            system=system_prompt,
            temperature=0.15,
        )
        claims = await self._extract_user_claims(request.message)

        sources = await self._source_service.format_document_sources(context_documents)
        if not has_docs:
            claims = [self._confidence_service.cap_claim_without_sources(c) for c in claims]

        confidence = self._confidence_service.score_answer(
            answer=answer,
            claims=claims,
            has_sources=bool(sources),
        )

        await self._persist_message(conversation_id, "assistant", answer)

        return ChatResponse(
            answer=answer,
            confidence=confidence,
            sources=[source.model_dump() for source in sources],
            claims=claims,
        )

    async def _resolve_conversation_id(self, conversation_id: str | None) -> uuid.UUID | None:
        if conversation_id:
            try:
                return uuid.UUID(conversation_id)
            except ValueError:
                logger.warning("Invalid conversation_id received", extra={"conversation_id": conversation_id})

        if self._conversation_repository is None:
            return None

        try:
            conversation = await self._conversation_repository.create()
            return conversation.id
        except Exception as exc:
            logger.warning(
                "Conversation persistence skipped",
                extra={"error": str(exc)},
            )
            return None

    async def _persist_message(
        self,
        conversation_id: uuid.UUID | None,
        role: str,
        content: str,
    ) -> None:
        if self._conversation_repository is None or conversation_id is None:
            return
        await self._conversation_repository.add_message(conversation_id, role, content)

    async def _extract_user_claims(self, user_message: str) -> list[ClaimSchema]:
        """Verify the user's claim/question (single claim for speed)."""
        try:
            claim = user_message.strip()
            if not claim:
                return []
            verified = await self._fact_check_service.verify_claim(claim)
            return [verified]
        except Exception as exc:
            logger.warning(
                "Claim verification for user message failed",
                extra={"error": str(exc)},
            )
            return []

    @staticmethod
    def _build_context_block(documents: list[dict]) -> str:
        if not documents:
            return ""
        blocks = []
        for index, document in enumerate(documents, start=1):
            blocks.append(
                f"[{index}] {document.get('title', 'Untitled')}\n{document.get('content', '')}"
            )
        return "\n\n".join(blocks)
