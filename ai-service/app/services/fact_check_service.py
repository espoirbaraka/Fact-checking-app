from typing import Any

from app.core.config import Settings
from app.core.logging import get_logger
from app.schemas.common import ClaimSchema, EvidenceSchema, SourceSchema
from app.services.confidence_service import ConfidenceService
from app.services.qwen_service import QwenService
from app.utils.parsing import normalize_verdict, parse_json_from_llm

logger = get_logger(__name__)

OPENFACTCHECK_AVAILABLE = False
OpenFactCheck: Any = None
OpenFactCheckConfig: Any = None

try:
    from openfactcheck import OpenFactCheck as _OpenFactCheck
    from openfactcheck import OpenFactCheckConfig as _OpenFactCheckConfig

    OpenFactCheck = _OpenFactCheck
    OpenFactCheckConfig = _OpenFactCheckConfig
    OPENFACTCHECK_AVAILABLE = True
except ImportError:
    logger.warning("OpenFactCheck is not installed; using placeholder fact-check pipeline")


class FactCheckService:
    def __init__(
        self,
        settings: Settings,
        qwen_service: QwenService,
        confidence_service: ConfidenceService,
    ) -> None:
        self._settings = settings
        self._qwen_service = qwen_service
        self._confidence_service = confidence_service
        self._openfactcheck: Any | None = None

        if settings.openfactcheck_enabled and OPENFACTCHECK_AVAILABLE:
            config = OpenFactCheckConfig()
            self._openfactcheck = OpenFactCheck(config)
            logger.info("OpenFactCheck integration enabled")

    async def extract_claims(self, text: str) -> list[str]:
        if self._openfactcheck is not None:
            return await self._extract_claims_with_openfactcheck(text)
        return await self._extract_claims_with_llm(text)

    async def verify_claim(self, claim: str) -> ClaimSchema:
        if self._openfactcheck is not None:
            return await self._verify_claim_with_openfactcheck(claim)
        return await self._verify_claim_with_llm(claim)

    async def fact_check_text(self, text: str) -> list[ClaimSchema]:
        claims = await self.extract_claims(text)
        if not claims:
            return [
                ClaimSchema(
                    claim=text.strip(),
                    verdict="unverifiable",
                    confidence=0.3,
                    evidence=[],
                    sources=[],
                )
            ]

        results: list[ClaimSchema] = []
        for claim in claims:
            result = await self.verify_claim(claim)
            results.append(result)
        return results

    async def _extract_claims_with_openfactcheck(self, text: str) -> list[str]:
        try:
            evaluator = self._openfactcheck.ResponseEvaluator
            result = evaluator.evaluate(text)
            if isinstance(result, dict):
                claims = result.get("claims", [])
                if isinstance(claims, list):
                    return [str(claim) for claim in claims if str(claim).strip()]
        except Exception as exc:
            logger.warning(
                "OpenFactCheck claim extraction failed; falling back to LLM",
                extra={"error": str(exc)},
            )
        return await self._extract_claims_with_llm(text)

    async def _verify_claim_with_openfactcheck(self, claim: str) -> ClaimSchema:
        try:
            evaluator = self._openfactcheck.ResponseEvaluator
            result = evaluator.evaluate(claim)
            if isinstance(result, dict):
                verdict = normalize_verdict(str(result.get("verdict", "unverifiable")))
                confidence = self._confidence_service.extract_confidence_from_text(
                    str(result),
                    default=float(result.get("confidence", 0.5)),
                )
                evidence = self._map_evidence(result.get("evidence", []))
                sources = self._map_sources(result.get("sources", []))
                claim_schema = ClaimSchema(
                    claim=claim,
                    verdict=verdict,
                    confidence=confidence,
                    evidence=evidence,
                    sources=sources,
                )
                claim_schema.confidence = self._confidence_service.score_claim(claim_schema)
                return claim_schema
        except Exception as exc:
            logger.warning(
                "OpenFactCheck verification failed; falling back to LLM",
                extra={"error": str(exc)},
            )
        return await self._verify_claim_with_llm(claim)

    async def _extract_claims_with_llm(self, text: str) -> list[str]:
        system_prompt = (
            "You are a fact-checking assistant. Extract atomic, verifiable factual "
            "claims from the input text. Return only valid JSON."
        )
        prompt = (
            "Extract all verifiable factual claims from the following text.\n"
            'Return JSON in this format: {"claims": ["claim 1", "claim 2"]}\n\n'
            f"Text:\n{text}"
        )
        response = await self._qwen_service.generate_response(
            prompt=prompt,
            system=system_prompt,
            temperature=0.0,
        )
        parsed = parse_json_from_llm(response)
        if isinstance(parsed, dict) and isinstance(parsed.get("claims"), list):
            return [str(claim).strip() for claim in parsed["claims"] if str(claim).strip()]

        sentences = [sentence.strip() for sentence in text.split(".") if sentence.strip()]
        return sentences[:3] if sentences else [text.strip()]

    async def _verify_claim_with_llm(self, claim: str) -> ClaimSchema:
        system_prompt = (
            "Tu es un fact-checker rigoureux pour le Nord-Kivu (RD Congo). "
            "Évalue avec prudence. Réponds UNIQUEMENT en JSON valide. "
            "Faits stables: Goma = chef-lieu du Nord-Kivu ; "
            "Bukavu = chef-lieu du Sud-Kivu. "
            "Sans source documentaire fournie: pour l'actualité récente "
            "(combats, camps, chiffres) préfère unverifiable et confidence <= 0.45. "
            "Pour faits administratifs/géographiques stables, true/false est acceptable "
            "avec confidence modérée (0.5-0.7). "
            "N'invente jamais d'URL."
        )
        prompt = (
            "Vérifie l'affirmation suivante (Nord-Kivu / Est RDC).\n"
            "Contexte: aucune base documentaire n'est injectée ici — "
            "tu n'as que tes connaissances générales.\n"
            "Retourne JSON:\n"
            "{\n"
            '  "verdict": "true|false|partially_true|misleading|unverifiable",\n'
            '  "confidence": 0.0,\n'
            '  "evidence": [{"text": "élément de preuve OU de doute"}],\n'
            '  "sources": []\n'
            "}\n"
            "Règles: sources doit rester [] si tu n'as pas d'URL réelle. "
            "Pour rumeurs WhatsApp / combats / chiffres: unverifiable "
            "sauf si le fait est géographique/administratif très stable.\n\n"
            f"Affirmation: {claim}"
        )
        response = await self._qwen_service.generate_response(
            prompt=prompt,
            system=system_prompt,
            temperature=0.05,
        )
        parsed = parse_json_from_llm(response)
        if not isinstance(parsed, dict):
            parsed = {}

        verdict = normalize_verdict(str(parsed.get("verdict", "unverifiable")))
        confidence = self._confidence_service.extract_confidence_from_text(
            response,
            default=float(parsed.get("confidence", 0.4)),
        )
        evidence = self._map_evidence(parsed.get("evidence", []))
        sources = self._map_sources(parsed.get("sources", []))
        # Drop hallucinated placeholder URLs
        sources = [
            s
            for s in sources
            if s.url
            and not any(
                bad in (s.url or "").lower()
                for bad in ("example.com", "localhost", "http://...", "https://...")
            )
        ]

        claim_schema = ClaimSchema(
            claim=claim,
            verdict=verdict,
            confidence=confidence,
            evidence=evidence,
            sources=sources,
        )
        claim_schema.confidence = self._confidence_service.score_claim(claim_schema)
        claim_schema = self._confidence_service.cap_claim_without_sources(claim_schema)
        return claim_schema

    @staticmethod
    def _map_evidence(raw_evidence: Any) -> list[EvidenceSchema]:
        evidence_items: list[EvidenceSchema] = []
        if not isinstance(raw_evidence, list):
            return evidence_items

        for item in raw_evidence:
            if isinstance(item, str):
                evidence_items.append(EvidenceSchema(text=item))
            elif isinstance(item, dict) and item.get("text"):
                source = None
                if isinstance(item.get("source"), dict):
                    source = SourceSchema(**item["source"])
                evidence_items.append(
                    EvidenceSchema(
                        text=str(item["text"]),
                        source=source,
                        relevance_score=item.get("relevance_score"),
                    )
                )
        return evidence_items

    @staticmethod
    def _map_sources(raw_sources: Any) -> list[SourceSchema]:
        sources: list[SourceSchema] = []
        if not isinstance(raw_sources, list):
            return sources

        for item in raw_sources:
            if isinstance(item, dict):
                sources.append(
                    SourceSchema(
                        title=item.get("title"),
                        url=item.get("url"),
                        snippet=item.get("snippet"),
                        relevance_score=item.get("relevance_score"),
                    )
                )
        return sources
