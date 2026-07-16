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
_VERDICT_LINE_RE = re.compile(
    r"^\s*(?:\*\*)?\s*(?:verdict\s*[:=]?\s*)?(oui|non)\b",
    re.IGNORECASE,
)
_NEGATIVE_MARKERS = (
    "n'est pas confirm",
    "ne confirme pas",
    "pas confirmée",
    "pas confirmee",
    "est fausse",
    "est faux",
    "contredit",
    "infirme",
    "a été tué",
    "a ete tue",
    "est mort",
    "n'est plus en vie",
    "n est plus en vie",
    "aucune source",
    "pas de source",
    "ne soutient pas",
    "ne soutiennent pas",
    "dément",
    "dement",
    "réfute",
    "refute",
)
_POSITIVE_MARKERS = (
    "est confirmée",
    "est confirmee",
    "est confirmé",
    "est confirme",
    "est vraie",
    "est vrai",
    "corrobore",
    "soutient l'affirmation",
    "confirment que",
    "confirme que",
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
        has_sources = bool(sources)
        confidence = self._confidence_service.confidence_from_sources(sources)
        percent = int(round(confidence * 100))

        if not has_sources:
            # Zero sites found → always Non (low %)
            label = "non"
            system_prompt = (
                "Tu es un assistant de fact-checking pour le Nord-Kivu (RD Congo). "
                "Réponds en français.\n"
                "Aucune source n'a été trouvée: le verdict est NON. "
                "Ne réécris pas Oui/Non ni de pourcentage.\n"
                "Règles:\n"
                "1) Justification courte (2-4 phrases).\n"
                "2) Dis clairement qu'aucune source crédible n'a été trouvée, "
                "donc l'affirmation est considérée comme fausse / non confirmée.\n"
                "3) Conseille de croiser radio communautaire, ONG, presse et autorités.\n"
                "4) N'invente jamais d'URL, de dates ou de citations.\n"
                "5) N'utilise jamais le tiret long (—). Préfère virgules, points ou parenthèses."
            )
            prompt = (
                "Aucune source de référence n'a été trouvée.\n\n"
                f"Affirmation / question:\n{request.message}"
            )
            justification = await self._qwen_service.generate_response(
                prompt=prompt,
                system=system_prompt,
                temperature=0.15,
            )
        else:
            # Sources found → Oui/Non comes from the analysis, not from source count
            system_prompt = (
                "Tu es un assistant de fact-checking pour le Nord-Kivu (RD Congo). "
                "Réponds en français.\n"
                "Règles:\n"
                "1) Première ligne EXACTEMENT: VERDICT: OUI  ou  VERDICT: NON\n"
                "   - OUI = les sources confirment l'affirmation / la réponse à la question est oui.\n"
                "   - NON = les sources contredisent l'affirmation, ou ne la confirment pas.\n"
                "2) Ensuite: justification (2-4 phrases) basée UNIQUEMENT sur les sources fournies.\n"
                "3) Cite 1-2 sources avec leur domaine (ex: [source: radiookapi.net]).\n"
                "4) N'invente jamais d'URL, de dates ou de citations.\n"
                "5) Faits stables: Goma = chef-lieu du Nord-Kivu ; "
                "Bukavu = chef-lieu du Sud-Kivu.\n"
                "6) N'écris PAS de pourcentage.\n"
                "7) N'utilise jamais le tiret long (—). Préfère virgules, points ou parenthèses."
            )
            prompt = (
                f"Documents de référence:\n{context_block}\n\n"
                f"Affirmation / question à vérifier:\n{request.message}\n\n"
                "Commence par VERDICT: OUI ou VERDICT: NON selon ce que disent vraiment les sources."
            )
            raw = await self._qwen_service.generate_response(
                prompt=prompt,
                system=system_prompt,
                temperature=0.15,
            )
            label, justification = self._parse_analysis_verdict(raw)

        justification = self._strip_verdict_header(justification)
        justification = self._sanitize_human_style(justification)
        answer = f"**{label.capitalize()} {percent}%**\n\n{justification}".strip()

        claims = [
            ClaimSchema(
                claim=request.message.strip(),
                verdict="true" if label == "oui" else "false",
                confidence=confidence,
                evidence=[
                    EvidenceSchema(
                        text=(
                            justification[:400]
                            if justification
                            else (
                                f"{len(sources)} source(s) trouvée(s)."
                                if has_sources
                                else "Aucune source crédible trouvée."
                            )
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

    @classmethod
    def _parse_analysis_verdict(cls, text: str) -> tuple[str, str]:
        """Extract Oui/Non from the model reply; fall back to content heuristics."""
        raw = (text or "").strip()
        if not raw:
            return "non", "Les sources ne permettent pas de confirmer l'affirmation."

        first_line, _, rest = raw.partition("\n")
        match = _VERDICT_LINE_RE.match(first_line.strip())
        if match:
            label = match.group(1).lower()
            justification = rest.strip() or cls._strip_verdict_header(raw)
            return label, justification

        # Model forgot the header: infer from justification wording
        lowered = raw.lower()
        neg = sum(1 for marker in _NEGATIVE_MARKERS if marker in lowered)
        pos = sum(1 for marker in _POSITIVE_MARKERS if marker in lowered)
        if neg > pos:
            return "non", raw
        if pos > neg:
            return "oui", raw
        # Ambiguous with sources present: prefer Non (not confirmed)
        return "non", raw

    @staticmethod
    def _sanitize_human_style(text: str) -> str:
        """Remove AI-looking long dashes from model output."""
        cleaned = (text or "").replace("—", ",").replace("–", ",")
        cleaned = re.sub(r",\s*,+", ",", cleaned)
        cleaned = re.sub(r"[ \t]+,", ",", cleaned)
        return cleaned.strip()

    @staticmethod
    def _strip_verdict_header(text: str) -> str:
        cleaned = (text or "").strip()
        cleaned = _VERDICT_HEADER_RE.sub("", cleaned, count=1).strip()
        # Also drop a leading "VERDICT: OUI/NON" line if still present
        lines = cleaned.splitlines()
        if lines and _VERDICT_LINE_RE.match(lines[0].strip()):
            cleaned = "\n".join(lines[1:]).strip()
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
