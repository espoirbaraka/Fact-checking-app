from typing import Any

import httpx

from app.core.config import Settings
from app.core.logging import get_logger
from app.utils.exceptions import ExternalServiceError

logger = get_logger(__name__)


class OllamaService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._base_url = settings.ollama_url.rstrip("/")
        self._default_model = settings.ollama_model
        self._fallback_model = settings.ollama_fallback_model
        self._client = httpx.AsyncClient(
            base_url=self._base_url,
            timeout=httpx.Timeout(90.0, connect=10.0),
        )

    async def close(self) -> None:
        await self._client.aclose()

    async def health_check(self) -> bool:
        try:
            response = await self._client.get("/api/tags")
            response.raise_for_status()
            return True
        except httpx.HTTPError as exc:
            logger.warning("Ollama health check failed", extra={"error": str(exc)})
            return False

    async def generate(
        self,
        prompt: str,
        model: str | None = None,
        system: str | None = None,
        temperature: float = 0.2,
    ) -> str:
        payload: dict[str, Any] = {
            "model": model or self._default_model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": temperature},
        }
        if system:
            payload["system"] = system

        try:
            response = await self._client.post("/api/generate", json=payload)
            response.raise_for_status()
            data = response.json()
            return str(data.get("response", "")).strip()
        except httpx.HTTPError as exc:
            logger.error("Ollama generation failed", extra={"error": str(exc), "model": payload["model"]})
            if (
                self._fallback_model
                and payload["model"] != self._fallback_model
            ):
                try:
                    fallback_payload = dict(payload)
                    fallback_payload["model"] = self._fallback_model
                    logger.warning(
                        "Retrying Ollama generation with fallback model",
                        extra={"fallback_model": self._fallback_model},
                    )
                    response = await self._client.post("/api/generate", json=fallback_payload)
                    response.raise_for_status()
                    data = response.json()
                    return str(data.get("response", "")).strip()
                except httpx.HTTPError as fallback_exc:
                    logger.error(
                        "Fallback Ollama generation failed",
                        extra={"error": str(fallback_exc), "model": self._fallback_model},
                    )
                    raise ExternalServiceError(
                        message=f"Ollama service unavailable: {fallback_exc}",
                        status_code=502,
                    ) from fallback_exc
            raise ExternalServiceError(
                message=f"Ollama service unavailable: {exc}",
                status_code=502,
            ) from exc
