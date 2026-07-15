import uuid
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.document import Document


class DocumentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(
        self,
        title: str,
        content: str,
        source_url: str | None = None,
        embedding: list[float] | None = None,
    ) -> Document:
        document = Document(
            title=title,
            content=content,
            source_url=source_url,
            embedding=embedding,
        )
        self._session.add(document)
        await self._session.flush()
        await self._session.refresh(document)
        return document

    async def get_by_id(self, document_id: uuid.UUID) -> Document | None:
        result = await self._session.execute(
            select(Document).where(Document.id == document_id)
        )
        return result.scalar_one_or_none()

    async def list_all(self, limit: int = 100, offset: int = 0) -> Sequence[Document]:
        result = await self._session.execute(
            select(Document).order_by(Document.created_at.desc()).limit(limit).offset(offset)
        )
        return result.scalars().all()

    async def semantic_search(
        self,
        query_embedding: list[float],
        limit: int = 5,
    ) -> Sequence[Document]:
        if not query_embedding:
            return []

        distance = Document.embedding.cosine_distance(query_embedding)
        result = await self._session.execute(
            select(Document)
            .where(Document.embedding.is_not(None))
            .order_by(distance)
            .limit(limit)
        )
        return result.scalars().all()
