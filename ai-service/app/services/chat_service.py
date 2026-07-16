import re
import uuid

from app.core.logging import get_logger
from app.repositories.conversation_repository import ConversationRepository
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.common import ClaimSchema, EvidenceSchema
from app.services.confidence_service import ConfidenceService
from app.services.fact_check_service import FactCheckService
from app.services.qwen_service import QwenService
from app.services.rag_service import RAGService
from app.services.source_service import SourceService
from app.services.web_research_service import WebResearchService

logger = get_logger(__name__)

_VERDICT_HEADER_RE = re.compile(
    r"^\s*(\*\*)?\s*(oui|non)\s+\d{1,3}\s*%\s*(\*\*)?\s*",
    re.IGNORECASE,
)


class ChatService:
    def __init__(
        self,
        qwen_service: QwenService,
        fact_check_service: FactCheckService,
        rag_service: RAGService,
        web_research_service: WebResearchService,
        confidence_service: ConfidenceService,
        source_service: SourceService,
        conversation_repository: ConversationRepository | None = None,
    ) -> None:
        self._qwen_service = qwen_service
        self._fact_check_service = fact_check_service
        self._rag_service = rag_service
        self._web_research_service = web_research_service
        self._confidence_service = confidence_service
        self._source_service = source_service
        self._conversation_repository = conversation_repository

    async def process_chat(self, request: ChatRequest) -> ChatResponse:
        conversation_id = await self._resolve_conversation_id(request.conversation_id)
        await self._persist_message(conversation_id, "user", request.message)

        context_documents = await self._rag_service.retrieve_documents(request.message)
        web_references = await self._web_research_service.search(request.message)
        context_block = self._build_context_block(context_documents, web_references)

        doc_sources = await self._source_service.format_document_sources(context_documents)
        web_sources = await self._source_service.format_web_sources(web_references)
        sources = [*web_sources, *doc_sources]

        # Binary rule: sources → Oui ; no sources → Non
        label, confidence = self._confidence_service.verdict_from_sources(sources)
        percent = int(round(confidence * 100))
        has_sources = bool(sources)

        if has_sources:
            system_prompt = (
                "Tu es un assistant de fact-checking pour le Nord-Kivu (RD Congo). "
                "Réponds en français.\n"
                "Le système a DÉJÀ décidé le verdict: OUI (information trouvée). "
                "Tu ne dois PAS écrire Oui/Non ni de pourcentage.\n"
                "Règles:\n"
                "1) Rédige uniquement la justification (2-4 phrases).\n"
                "2) Explique pourquoi l'affirmation est confirmée à partir des sources.\n"
                "3) Cite au moins 1-2 sources avec leur domaine "
                "(ex: [source: radiookapi.net]).\n"
                "4) N'invente jamais d'URL, de dates ou de citations.\n"
                "5) Faits stables: Goma = chef-lieu du Nord-Kivu ; "
                "Bukavu = chef-lieu du Sud-Kivu."
            )
            prompt = (
                f"Documents de référence:\n{context_block}\n\n"
                f"Affirmation / question à justifier (verdict = OUI {percent}%):\n"
                f"{request.message}"
            )
        else:
            system_prompt = (
                "Tu es un assistant de fact-checking pour le Nord-Kivu (RD Congo). "
                "Réponds en français.\n"
                "Le système a DÉJÀ décidé le verdict: NON (aucune source trouvée). "
                "Tu ne dois PAS écrire Oui/Non ni de pourcentage.\n"
                "Règles:\n"
                "1) Rédige uniquement la justification (2-4 phrases).\n"
                "2) Affirme clairement qu'aucune source crédible n'a été trouvée, "
                "donc l'information est considérée comme fausse / non confirmée.\n"
                "3) Conseille de croiser radio communautaire, ONG, presse et autorités.\n"
                "4) N'invente jamais d'URL, de dates ou de citations."
            )
            prompt = (
                "Aucune source de référence n'a été trouvée pour cette requête.\n\n"
                f"Affirmation / question à justifier (verdict = NON {percent}%):\n"
                f"{request.message}"
            )

        justification = await self._qwen_service.generate_response(
            prompt=prompt,
            system=system_prompt,
            temperature=0.15,
        )
        justification = self._strip_verdict_header(justification)
        answer = f"**{label.capitalize()} {percent}%**\n\n{justification}".strip()

        claims = [
            ClaimSchema(
                claim=request.message.strip(),
                verdict="true" if label == "oui" else "false",
                confidence=confidence,
                evidence=[
                    EvidenceSchema(
                        text=(
                            f"{len(sources)} source(s) trouvée(s)."
                            if has_sources
                            else "Aucune source crédible trouvée."
                        )
                    )
                ],
                sources=sources,
            )
        ]

        await self._persist_message(conversation_id, "assistant", answer)

        return ChatResponse(
            answer=answer,
            confidence=confidence,
            sources=[source.model_dump() for source in sources],
            claims=claims,
        )

    @staticmethod
    def _strip_verdict_header(text: str) -> str:
        cleaned = _VERDICT_HEADER_RE.sub("", text or "", count=1).strip()
        return cleaned or (text or "").strip()

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
    def _build_context_block(documents: list[dict], web_references: list[dict]) -> str:
        if not documents and not web_references:
            return ""
        blocks = []
        for index, reference in enumerate(web_references, start=1):
            blocks.append(
                (
                    f"[WEB-{index}] {reference.get('title', 'Untitled')} "
                    f"({reference.get('domain', 'unknown')})\n"
                    f"URL: {reference.get('url', '')}\n"
                    f"Résumé: {reference.get('snippet', '')}"
                )
            )
        for index, document in enumerate(documents, start=1):
            blocks.append(
                f"[DOC-{index}] {document.get('title', 'Untitled')}\n{document.get('content', '')}"
            )
        return "\n\n".join(blocks)
