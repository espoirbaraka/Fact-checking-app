import asyncio
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
        """Search trusted media first, then fall back to the open web."""
        if not self._enabled:
            logger.warning("Web research disabled")
            return []

        cleaned = (query or "").strip()
        if not cleaned:
            return []

        focus = self._focus_query(cleaned)
        domains = self._trusted_domains[:8]

        # Parallel: one query per trusted site + one general web query
        tasks = [
            self._search_query(f"{focus} site:{domain}", trusted_only=True, limit=2)
            for domain in domains
        ]
        tasks.append(self._search_query(focus, trusted_only=False, limit=self._max_results))

        batches = await asyncio.gather(*tasks, return_exceptions=True)

        trusted: list[dict] = []
        general: list[dict] = []
        for index, batch in enumerate(batches):
            if isinstance(batch, Exception):
                logger.warning("Web search batch failed", extra={"error": str(batch)})
                continue
            if index < len(domains):
                trusted.extend(batch)
            else:
                general.extend(batch)

        merged = self._dedupe(trusted + general)
        if not merged:
            logger.warning("Web research returned no results", extra={"query": focus[:120]})
        else:
            logger.info(
                "Web research results",
                extra={
                    "query": focus[:120],
                    "count": len(merged),
                    "trusted": sum(
                        1
                        for item in merged
                        if self._is_trusted_domain(str(item.get("domain") or ""))
                    ),
                },
            )
        return merged[: self._max_results]

    async def search_trusted(self, query: str, limit: int = 8) -> list[dict]:
        if not self.enabled or limit <= 0:
            return []
        return await self._search_query(query, trusted_only=True, limit=limit)

    async def _search_query(
        self,
        query: str,
        trusted_only: bool,
        limit: int,
    ) -> list[dict]:
        if limit <= 0:
            return []
        # Prefer ddgs (handles DDG bot challenges); fall back to HTML scrape
        results = await asyncio.to_thread(self._search_ddgs_sync, query, limit * 3)
        if not results:
            results = await self._search_duckduckgo_html(query, limit=limit * 3)

        scored: list[dict] = []
        for candidate in results:
            url = candidate.get("url") or ""
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
                    "snippet": candidate.get("snippet") or "",
                    "relevance_score": 0.95 if is_trusted else 0.65,
                    "domain": domain,
                }
            )
            if len(scored) >= limit:
                break
        return scored

    def _search_ddgs_sync(self, query: str, limit: int) -> list[dict]:
        try:
            from ddgs import DDGS
        except ImportError:
            logger.warning("ddgs package not installed; HTML fallback only")
            return []

        try:
            with DDGS() as client:
                raw = list(client.text(query, max_results=max(1, limit), region="wt-wt"))
        except Exception as exc:
            logger.warning("ddgs search failed", extra={"error": str(exc), "query": query[:120]})
            return []

        results: list[dict] = []
        for item in raw:
            url = item.get("href") or item.get("link") or ""
            if not url:
                continue
            results.append(
                {
                    "title": item.get("title") or "",
                    "url": url,
                    "snippet": (item.get("body") or "")[:280],
                }
            )
        return results

    @staticmethod
    def _focus_query(query: str) -> str:
        text = re.sub(r"\s+", " ", query).strip()
        if len(text) <= 180:
            return text
        return text[:177].rsplit(" ", 1)[0] + "…"

    @staticmethod
    def _dedupe(items: list[dict]) -> list[dict]:
        unique: list[dict] = []
        seen: set[str] = set()
        for item in items:
            url = item.get("url")
            if not url or url in seen:
                continue
            seen.add(url)
            unique.append(item)
        return unique

    async def _search_duckduckgo_html(self, query: str, limit: int) -> list[dict]:
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
                    ),
                    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
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
            logger.warning(
                "Web search HTML failed",
                extra={"error": str(exc), "query": query[:120]},
            )
            return []

        results: list[dict] = []
        for candidate in candidates[:limit]:
            url = self._normalize_duckduckgo_url(candidate.get("url", ""))
            if not url:
                continue
            results.append(
                {
                    "title": candidate.get("title") or "",
                    "url": url,
                    "snippet": candidate.get("snippet") or "",
                }
            )
        return results

    def _extract_duckduckgo_results(self, html_text: str) -> list[dict]:
        pattern = re.compile(
            r'<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="(?P<url>[^"]+)"[^>]*>(?P<title>.*?)</a>.*?'
            r'(?:<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>(?P<snippet>.*?)</a>'
            r'|<td[^>]*class="[^"]*result__snippet[^"]*"[^>]*>(?P<snippet2>.*?)</td>)',
            re.DOTALL,
        )
        results: list[dict] = []
        for match in pattern.finditer(html_text):
            title = self._clean_html(match.group("title"))
            snippet = self._clean_html(match.group("snippet") or match.group("snippet2") or "")
            results.append(
                {
                    "url": html.unescape(match.group("url")),
                    "title": title,
                    "snippet": snippet[:280],
                }
            )
        if results:
            return results

        loose = re.compile(
            r'<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="(?P<url>[^"]+)"[^>]*>(?P<title>.*?)</a>',
            re.DOTALL,
        )
        for match in loose.finditer(html_text):
            results.append(
                {
                    "url": html.unescape(match.group("url")),
                    "title": self._clean_html(match.group("title")),
                    "snippet": "",
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
