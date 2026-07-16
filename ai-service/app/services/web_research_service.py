import html
import re
from urllib.parse import parse_qs, unquote, urlparse

import httpx

from app.core.config import Settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class WebResearchService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._trusted_domains = settings.trusted_domains
        self._max_results = max(1, settings.web_research_max_results)
        self._enabled = settings.web_research_enabled

    @property
    def enabled(self) -> bool:
        return self._enabled

    async def search(self, query: str) -> list[dict]:
        if not self._enabled:
            return []

        trusted_hits = await self._search_duckduckgo(
            query=f"{query} " + " OR ".join(f"site:{d}" for d in self._trusted_domains[:6]),
            trusted_only=True,
            limit=self._max_results,
        )
        if len(trusted_hits) >= self._max_results:
            return trusted_hits[: self._max_results]

        general_hits = await self._search_duckduckgo(
            query=query,
            trusted_only=False,
            limit=self._max_results - len(trusted_hits),
        )
        merged = trusted_hits + general_hits
        unique: list[dict] = []
        seen: set[str] = set()
        for item in merged:
            url = item.get("url")
            if not url or url in seen:
                continue
            seen.add(url)
            unique.append(item)
        return unique[: self._max_results]

    async def _search_duckduckgo(
        self,
        query: str,
        trusted_only: bool,
        limit: int,
    ) -> list[dict]:
        if limit <= 0:
            return []
        try:
            async with httpx.AsyncClient(
                timeout=httpx.Timeout(20.0, connect=8.0),
                headers={
                    "User-Agent": (
                        "Mozilla/5.0 (X11; Linux x86_64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/126.0.0.0 Safari/537.36"
                    )
                },
                follow_redirects=True,
            ) as client:
                response = await client.get(
                    "https://duckduckgo.com/html/",
                    params={"q": query},
                )
                response.raise_for_status()
                candidates = self._extract_duckduckgo_results(response.text)
        except Exception as exc:
            logger.warning("Web search failed", extra={"error": str(exc), "query": query})
            return []

        scored: list[dict] = []
        for candidate in candidates:
            url = self._normalize_duckduckgo_url(candidate.get("url", ""))
            if not url:
                continue
            domain = self._extract_domain(url)
            if not domain:
                continue
            is_trusted = self._is_trusted_domain(domain)
            if trusted_only and not is_trusted:
                continue
            scored.append(
                {
                    "title": candidate.get("title") or domain,
                    "url": url,
                    "snippet": candidate.get("snippet"),
                    "relevance_score": 0.95 if is_trusted else 0.65,
                    "domain": domain,
                }
            )
            if len(scored) >= limit:
                break
        return scored

    def _extract_duckduckgo_results(self, html_text: str) -> list[dict]:
        pattern = re.compile(
            r'<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="(?P<url>[^"]+)"[^>]*>(?P<title>.*?)</a>.*?'
            r'<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>(?P<snippet>.*?)</a>',
            re.DOTALL,
        )
        results: list[dict] = []
        for match in pattern.finditer(html_text):
            title = self._clean_html(match.group("title"))
            snippet = self._clean_html(match.group("snippet"))
            results.append(
                {
                    "url": html.unescape(match.group("url")),
                    "title": title,
                    "snippet": snippet[:280],
                }
            )
        return results

    @staticmethod
    def _clean_html(value: str) -> str:
        text = re.sub(r"<[^>]+>", " ", value)
        text = html.unescape(text)
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def _normalize_duckduckgo_url(self, raw_url: str) -> str | None:
        if raw_url.startswith("//"):
            raw_url = f"https:{raw_url}"
        parsed = urlparse(raw_url)
        if "duckduckgo.com" in (parsed.netloc or "") and parsed.path.startswith("/l/"):
            qs = parse_qs(parsed.query)
            target = qs.get("uddg", [None])[0]
            if target:
                return unquote(target)
            return None
        if raw_url.startswith("http://") or raw_url.startswith("https://"):
            return raw_url
        return None

    @staticmethod
    def _extract_domain(url: str) -> str | None:
        try:
            parsed = urlparse(url)
        except Exception:
            return None
        domain = (parsed.netloc or "").lower()
        if domain.startswith("www."):
            domain = domain[4:]
        return domain or None

    def _is_trusted_domain(self, domain: str) -> bool:
        return any(
            domain == trusted or domain.endswith(f".{trusted}")
            for trusted in self._trusted_domains
        )
