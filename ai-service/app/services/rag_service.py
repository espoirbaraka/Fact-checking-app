from app.core.logging import get_logger
from app.repositories.document_repository import DocumentRepository
from app.services.embedding_service import EmbeddingService

logger = get_logger(__name__)


class RAGService:
    def __init__(
        self,
        document_repository: DocumentRepository | None,
        embedding_service: EmbeddingService,
    ) -> None:
        self._document_repository = document_repository
        self._embedding_service = embedding_service

    async def retrieve_documents(self, query: str, limit: int = 5) -> list[dict]:
        """Retrieve relevant documents for a query via semantic search."""
        return await self.semantic_search(query=query, limit=limit)

    async def semantic_search(self, query: str, limit: int = 5) -> list[dict]:
        if self._document_repository is None:
            return []
        if not getattr(self._embedding_service, "available", True):
            return []

        try:
            existing = await self._document_repository.list_all(limit=1)
            if not existing:
                return []

            query_embedding = await self._embedding_service.generate_embedding(query)
            if not query_embedding:
                return []
            documents = await self._document_repository.semantic_search(
                query_embedding=query_embedding,
                limit=limit,
            )
            return [
                {
                    "id": str(document.id),
                    "title": document.title,
                    "content": document.content,
                    "source_url": document.source_url,
                }
                for document in documents
            ]
        except Exception as exc:
            logger.warning(
                "Semantic search failed; returning empty results",
                extra={"error": str(exc)},
            )
            return []
