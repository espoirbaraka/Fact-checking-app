from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import chat, fact_check, health
from app.core.config import Settings, get_settings
from app.core.logging import get_logger, setup_logging
from app.database.session import DatabaseSessionManager
from app.schemas.common import ErrorResponse
from app.services.embedding_service import EmbeddingService
from app.services.ollama_service import OllamaService
from app.utils.exceptions import AppException

logger = get_logger(__name__)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
        message = exc.detail if isinstance(exc.detail, str) else "Request failed"
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(success=False, message=message).model_dump(),
        )

    @app.exception_handler(AppException)
    async def app_exception_handler(_: Request, exc: AppException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(success=False, message=exc.message).model_dump(),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        _: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        message = "Validation error"
        if exc.errors():
            message = exc.errors()[0].get("msg", message)
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=ErrorResponse(success=False, message=message).model_dump(),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled exception", extra={"error": str(exc)})
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=ErrorResponse(
                success=False,
                message="Internal server error",
            ).model_dump(),
        )


def create_app(settings: Settings | None = None) -> FastAPI:
    app_settings = settings or get_settings()
    setup_logging(app_settings)

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        db_manager = DatabaseSessionManager(app_settings)
        ollama_service = OllamaService(app_settings)
        embedding_service = EmbeddingService(app_settings)

        app.state.db_manager = db_manager
        app.state.ollama_service = ollama_service
        app.state.embedding_service = embedding_service

        db_manager.init()
        try:
            await db_manager.create_tables()
        except Exception as exc:
            logger.warning(
                "Database initialization skipped or failed",
                extra={"error": str(exc)},
            )

        logger.info("Application startup complete", extra={"env": app_settings.app_env})
        yield

        await ollama_service.close()
        await db_manager.close()
        logger.info("Application shutdown complete")

    app = FastAPI(
        title=app_settings.app_name,
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=app_settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    app.include_router(health.router)
    app.include_router(chat.router)
    app.include_router(fact_check.router)

    return app


app = create_app()
