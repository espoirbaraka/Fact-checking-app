"""Fetch Nord-Kivu related headlines from trusted media sources."""

from __future__ import annotations

import asyncio

from app.core.config import Settings
from app.core.logging import get_logger
from app.services.web_research_service import WebResearchService

logger = get_logger(__name__)

NORD_KIVU_KEYWORDS = (
    "nord-kivu",
    "nord kivu",
    "goma",
    "masisi",
    "walikale",
    "rutshuru",
    "beni",
    "lubero",
    "butembo",
    "nyiragongo",
)

SEARCH_QUERIES = (
    "Nord-Kivu",
    "Goma Nord-Kivu",
    "Rutshuru OR Masisi OR Beni OR Butembo",
)


class NewsService:
    def __init__(
        self,
        settings: Settings,
        web_research: WebResearchService | None = None,
    ) -> None:
        self._settings = settings
        self._web = web_research or WebResearchService(settings=settings)

    async def get_nord_kivu_news(self, limit: int = 12) -> list[dict]:
        if not self._web.enabled:
            return []

        domains = self._settings.trusted_domains[:8]
        site_filter = " OR ".join(f"site:{d}" for d in domains[:5])
        tasks = [
            self._web.search_trusted(
                query=f"{query} {site_filter}",
                limit=8,
            )
            for query in SEARCH_QUERIES
        ]
        batches = await asyncio.gather(*tasks, return_exceptions=True)

        merged: list[dict] = []
        seen: set[str] = set()
        for batch in batches:
            if isinstance(batch, Exception):
                logger.warning("News batch failed", extra={"error": str(batch)})
                continue
            for item in batch:
                url = item.get("url")
                if not url or url in seen:
                    continue
                if not self._matches_nord_kivu(item):
                    continue
                seen.add(url)
                merged.append(
                    {
                        "title": item.get("title") or item.get("domain") or "Article",
                        "url": url,
                        "snippet": item.get("snippet") or "",
                        "domain": item.get("domain") or "",
                        "relevance_score": item.get("relevance_score"),
                    }
                )

        return merged[: max(1, limit)]

    @classmethod
    def _matches_nord_kivu(cls, item: dict) -> bool:
        haystack = f"{item.get('title', '')} {item.get('snippet', '')}".lower()
        # Normalize accents lightly for matching
        haystack = (
            haystack.replace("é", "e")
            .replace("è", "e")
            .replace("ê", "e")
            .replace("à", "a")
        )
        return any(keyword in haystack for keyword in NORD_KIVU_KEYWORDS)
