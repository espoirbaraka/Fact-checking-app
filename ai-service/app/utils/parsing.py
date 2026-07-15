import json
import re
from typing import Any


def parse_json_from_llm(response: str) -> Any | None:
    cleaned = response.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"(\[.*\]|\{.*\})", cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                return None
    return None


def normalize_verdict(raw_verdict: str) -> str:
    normalized = raw_verdict.strip().lower()
    mapping = {
        "true": "true",
        "correct": "true",
        "supported": "true",
        "false": "false",
        "incorrect": "false",
        "refuted": "false",
        "misleading": "misleading",
        "partially true": "partially_true",
        "partially_true": "partially_true",
        "unverifiable": "unverifiable",
        "unknown": "unverifiable",
        "insufficient evidence": "unverifiable",
    }
    return mapping.get(normalized, "unverifiable")
