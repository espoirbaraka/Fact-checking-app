import re
from typing import Any

from app.schemas.common import ClaimSchema, SourceSchema


class ConfidenceService:
    def score_claim(self, claim: ClaimSchema) -> float:
        base_confidence = self._clamp(claim.confidence)
        evidence_boost = min(len(claim.evidence) * 0.05, 0.15)
        source_boost = min(len(claim.sources) * 0.03, 0.1)
        verdict_penalty = 0.1 if claim.verdict == "unverifiable" else 0.0
        if not claim.sources and claim.verdict in ("true", "false"):
            base_confidence = min(base_confidence, 0.55)
        return self._clamp(base_confidence + evidence_boost + source_boost - verdict_penalty)

    def cap_claim_without_sources(self, claim: ClaimSchema) -> ClaimSchema:
        """When RAG has no docs, prevent overconfident true/false verdicts."""
        if claim.sources:
            return claim

        claim.sources = []
        if claim.verdict in ("true", "false", "partially_true", "misleading"):
            claim.confidence = min(self._clamp(claim.confidence), 0.45)
            if claim.verdict in ("true", "false") and claim.confidence < 0.4:
                claim.verdict = "unverifiable"
                claim.confidence = min(claim.confidence, 0.35)
        else:
            claim.confidence = min(self._clamp(claim.confidence), 0.4)
        return claim

    def verdict_from_sources(
        self,
        sources: list[SourceSchema | dict[str, Any]],
    ) -> tuple[str, float]:
        """
        Binary rule for Nord-Kivu fact-check UI:
        - sources found → Oui (true), % rises with count + reliability
        - no sources → Non (false), % stays low
        """
        if not sources:
            # No corroboration → Non with a low percentage
            return "non", 0.22

        scores = [self._source_reliability(source) for source in sources]
        count = len(scores)
        trusted_count = sum(1 for score in scores if score >= 0.9)
        average_reliability = sum(scores) / count

        # More sources → higher Oui %
        count_score = 0.52 + min(count, 5) * 0.08  # 1→60%, 2→68%, 3→76%, 4→84%, 5→92%
        trusted_bonus = min(trusted_count * 0.05, 0.15)
        quality_bonus = max(0.0, (average_reliability - 0.65) * 0.25)

        confidence = self._clamp(count_score + trusted_bonus + quality_bonus)
        # Cap slightly below 100% — never claim absolute certainty
        confidence = min(confidence, 0.95)
        return "oui", confidence

    def score_answer(
        self,
        answer: str,
        claims: list[ClaimSchema],
        has_sources: bool,
        source_count: int = 0,
        average_source_reliability: float | None = None,
    ) -> float:
        if not answer.strip():
            return 0.0

        if source_count > 0 or has_sources:
            # Prefer explicit source-based scoring when available
            synthetic = [
                {"relevance_score": average_source_reliability or 0.7}
                for _ in range(max(source_count, 1 if has_sources else 0))
            ]
            _, confidence = self.verdict_from_sources(synthetic)
            return confidence

        if claims:
            claim_scores = [self.score_claim(claim) for claim in claims]
            average_claim_confidence = sum(claim_scores) / len(claim_scores)
            return self._clamp(min(average_claim_confidence, 0.35))

        return 0.22

    def extract_confidence_from_text(self, text: str, default: float = 0.5) -> float:
        match = re.search(
            r"confidence\s*[:=]\s*(0?\.\d+|1(?:\.0+)?|0)",
            text,
            re.IGNORECASE,
        )
        if not match:
            return default
        try:
            return self._clamp(float(match.group(1)))
        except ValueError:
            return default

    @staticmethod
    def _source_reliability(source: SourceSchema | dict[str, Any]) -> float:
        if isinstance(source, SourceSchema):
            score = source.relevance_score
        else:
            score = source.get("relevance_score")
        if score is None:
            return 0.7
        return max(0.0, min(1.0, float(score)))

    @staticmethod
    def _clamp(value: float) -> float:
        return max(0.0, min(1.0, value))
