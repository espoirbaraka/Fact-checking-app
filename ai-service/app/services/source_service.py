from app.schemas.common import SourceSchema


class SourceService:
    async def resolve_sources(self, references: list[dict]) -> list[SourceSchema]:
        sources: list[SourceSchema] = []
        for reference in references:
            sources.append(
                SourceSchema(
                    title=reference.get("title"),
                    url=reference.get("url"),
                    snippet=reference.get("snippet"),
                    relevance_score=reference.get("relevance_score"),
                )
            )
        return sources

    async def format_document_sources(
        self,
        documents: list[dict],
    ) -> list[SourceSchema]:
        return [
            SourceSchema(
                title=document.get("title"),
                url=document.get("source_url"),
                snippet=document.get("content", "")[:500] or None,
                relevance_score=document.get("similarity"),
            )
            for document in documents
        ]

    async def format_web_sources(self, references: list[dict]) -> list[SourceSchema]:
        return [
            SourceSchema(
                title=reference.get("title"),
                url=reference.get("url"),
                snippet=reference.get("snippet"),
                relevance_score=reference.get("relevance_score"),
            )
            for reference in references
            if reference.get("url")
        ]
