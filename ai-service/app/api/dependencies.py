from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.database.session import DatabaseSessionManager
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.document_repository import DocumentRepository
from app.services.chat_service import ChatService
from app.services.confidence_service import ConfidenceService
from app.services.embedding_service import EmbeddingService
from app.services.fact_check_service import FactCheckService
from app.services.ollama_service import OllamaService
from app.services.qwen_service import QwenService
from app.services.rag_service import RAGService
from app.services.source_service import SourceService


def get_app_settings() -> Settings:
    return get_settings()


def get_db_manager(request: Request) -> DatabaseSessionManager:
    return request.app.state.db_manager


async def get_db_session(
    db_manager: Annotated[DatabaseSessionManager, Depends(get_db_manager)],
) -> AsyncGenerator[AsyncSession, None]:
    async for session in db_manager.get_session():
        yield session


def get_ollama_service(
    settings: Annotated[Settings, Depends(get_app_settings)],
    request: Request,
) -> OllamaService:
    return request.app.state.ollama_service


def get_qwen_service(
    settings: Annotated[Settings, Depends(get_app_settings)],
    ollama_service: Annotated[OllamaService, Depends(get_ollama_service)],
) -> QwenService:
    return QwenService(settings=settings, ollama_service=ollama_service)


def get_embedding_service(
    settings: Annotated[Settings, Depends(get_app_settings)],
    request: Request,
) -> EmbeddingService:
    return request.app.state.embedding_service


def get_confidence_service() -> ConfidenceService:
    return ConfidenceService()


def get_source_service() -> SourceService:
    return SourceService()


def get_document_repository(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> DocumentRepository:
    return DocumentRepository(session=session)


def get_conversation_repository(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> ConversationRepository:
    return ConversationRepository(session=session)


def get_rag_service(
    embedding_service: Annotated[EmbeddingService, Depends(get_embedding_service)],
    document_repository: Annotated[DocumentRepository, Depends(get_document_repository)],
) -> RAGService:
    return RAGService(
        document_repository=document_repository,
        embedding_service=embedding_service,
    )


def get_fact_check_service(
    settings: Annotated[Settings, Depends(get_app_settings)],
    qwen_service: Annotated[QwenService, Depends(get_qwen_service)],
    confidence_service: Annotated[ConfidenceService, Depends(get_confidence_service)],
) -> FactCheckService:
    return FactCheckService(
        settings=settings,
        qwen_service=qwen_service,
        confidence_service=confidence_service,
    )


def get_chat_service(
    qwen_service: Annotated[QwenService, Depends(get_qwen_service)],
    fact_check_service: Annotated[FactCheckService, Depends(get_fact_check_service)],
    rag_service: Annotated[RAGService, Depends(get_rag_service)],
    confidence_service: Annotated[ConfidenceService, Depends(get_confidence_service)],
    source_service: Annotated[SourceService, Depends(get_source_service)],
    conversation_repository: Annotated[
        ConversationRepository,
        Depends(get_conversation_repository),
    ],
) -> ChatService:
    return ChatService(
        qwen_service=qwen_service,
        fact_check_service=fact_check_service,
        rag_service=rag_service,
        confidence_service=confidence_service,
        source_service=source_service,
        conversation_repository=conversation_repository,
    )
