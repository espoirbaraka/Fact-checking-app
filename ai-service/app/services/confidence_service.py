import re

from app.schemas.common import ClaimSchema


class ConfidenceService:
    def score_claim(self, claim: ClaimSchema) -> float:
        base_confidence = self._clamp(claim.confidence)
        evidence_boost = min(len(claim.evidence) * 0.05, 0.15)
        source_boost = min(len(claim.sources) * 0.03, 0.1)
        verdict_penalty = 0.1 if claim.verdict == "unverifiable" else 0.0
        # Invented empty sources should not inflate confidence
        if not claim.sources and claim.verdict in ("true", "false"):
            base_confidence = min(base_confidence, 0.55)
        return self._clamp(base_confidence + evidence_boost + source_boost - verdict_penalty)

    def cap_claim_without_sources(self, claim: ClaimSchema) -> ClaimSchema:
        """When RAG has no docs, prevent overconfident true/false verdicts."""
        if claim.sources:
            return claim

        claim.sources = []
        if claim.verdict in ("true", "false", "partially_true", "misleading"):
            # Keep the orientation but force humility
            claim.confidence = min(self._clamp(claim.confidence), 0.45)
            if claim.verdict in ("true", "false") and claim.confidence < 0.4:
                claim.verdict = "unverifiable"
                claim.confidence = min(claim.confidence, 0.35)
        else:
            claim.confidence = min(self._clamp(claim.confidence), 0.4)
        return claim

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
            "non vérifiable",
            "non verifiable",
            "je ne suis pas sûr",
            "je ne suis pas sure",
            "incertitude",
            "sans source",
            "connaissances générales",
            "à croiser",
            "a croiser",
            "ne peut pas être confirmé",
            "ne peut pas etre confirme",
        )
        lowered = answer.lower()
        if any(marker in lowered for marker in uncertainty_markers):
            base = 0.35
            return self._clamp(base + (0.1 if has_sources else 0.0))

        if claims:
            claim_scores = [self.score_claim(claim) for claim in claims]
            average_claim_confidence = sum(claim_scores) / len(claim_scores)
            if not has_sources:
                average_claim_confidence = min(average_claim_confidence, 0.5)
            source_bonus = 0.05 if has_sources else -0.08
            return self._clamp(average_claim_confidence + source_bonus)

        length_factor = min(len(answer.split()) / 40, 1.0)
        base = 0.4 + (0.15 * length_factor)
        if not has_sources:
            base = min(base, 0.45)
        return self._clamp(base)

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
