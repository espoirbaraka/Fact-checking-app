from __future__ import annotations

import asyncio
from functools import partial
from typing import Any

from app.core.config import Settings
from app.core.logging import get_logger

logger = get_logger(__name__)

SentenceTransformer: Any = None
try:
    from sentence_transformers import SentenceTransformer as _SentenceTransformer

    SentenceTransformer = _SentenceTransformer
except ImportError:
    logger.warning(
        "sentence-transformers not installed; RAG embeddings disabled"
    )


class EmbeddingService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._model: Any | None = None
        self._lock = asyncio.Lock()
        self._available = SentenceTransformer is not None

    @property
    def available(self) -> bool:
        return self._available

    async def _get_model(self) -> Any:
        if not self._available:
            raise RuntimeError("sentence-transformers is not installed")

        if self._model is None:
            async with self._lock:
                if self._model is None:
                    logger.info(
                        "Loading embedding model",
                        extra={"model": self._settings.embedding_model},
                    )
                    loop = asyncio.get_running_loop()
                    self._model = await loop.run_in_executor(
                        None,
                        partial(
                            SentenceTransformer,
                            self._settings.embedding_model,
                        ),
                    )
        return self._model

    async def generate_embedding(self, text: str) -> list[float]:
        if not self._available:
            return []
        model = await self._get_model()
        loop = asyncio.get_running_loop()
        embedding = await loop.run_in_executor(
            None,
            partial(model.encode, text, normalize_embeddings=True),
        )
        return embedding.tolist()
