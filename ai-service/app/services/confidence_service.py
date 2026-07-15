import re

from app.schemas.common import ClaimSchema, EvidenceSchema


class ConfidenceService:
    def score_claim(self, claim: ClaimSchema) -> float:
        base_confidence = self._clamp(claim.confidence)
        evidence_boost = min(len(claim.evidence) * 0.05, 0.15)
        source_boost = min(len(claim.sources) * 0.03, 0.1)
        verdict_penalty = 0.05 if claim.verdict == "unverifiable" else 0.0
        return self._clamp(base_confidence + evidence_boost + source_boost - verdict_penalty)

    def score_answer(
        self,
        answer: str,
        claims: list[ClaimSchema],
        has_sources: bool,
    ) -> float:
        if not answer.strip():
            return 0.0

        uncertainty_markers = (
            "i don't know",
            "i am not sure",
            "cannot verify",
            "unable to determine",
        )
        lowered = answer.lower()
        if any(marker in lowered for marker in uncertainty_markers):
            return 0.35

        if claims:
            claim_scores = [self.score_claim(claim) for claim in claims]
            average_claim_confidence = sum(claim_scores) / len(claim_scores)
            source_bonus = 0.05 if has_sources else 0.0
            return self._clamp(average_claim_confidence + source_bonus)

        length_factor = min(len(answer.split()) / 40, 1.0)
        return self._clamp(0.55 + (0.25 * length_factor))

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
    def _clamp(value: float) -> float:
        return max(0.0, min(1.0, value))
