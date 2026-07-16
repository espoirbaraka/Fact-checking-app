from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.api.dependencies import get_chat_service, get_document_extract_service
from app.core.security import verify_api_key
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService
from app.services.document_extract_service import DocumentExtractService
from app.utils.exceptions import ValidationError

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post(
    "",
    response_model=ChatResponse,
    dependencies=[Depends(verify_api_key)],
)
async def chat(
    request: ChatRequest,
    chat_service: Annotated[ChatService, Depends(get_chat_service)],
) -> ChatResponse:
    return await chat_service.process_chat(request)


@router.post(
    "/upload",
    response_model=ChatResponse,
    dependencies=[Depends(verify_api_key)],
)
async def chat_with_upload(
    chat_service: Annotated[ChatService, Depends(get_chat_service)],
    extract_service: Annotated[
        DocumentExtractService,
        Depends(get_document_extract_service),
    ],
    file: UploadFile = File(...),
    message: str | None = Form(default=None),
    conversation_id: str | None = Form(default=None),
    language: str | None = Form(default="fr"),
) -> ChatResponse:
    """Extract text from image/PDF via OCR, then run the fact-check pipeline."""
    content = await file.read()
    filename = file.filename or "document"

    try:
        extracted = extract_service.extract(
            filename=filename,
            content=content,
            content_type=file.content_type,
        )
    except ValidationError:
        raise
    except Exception as exc:
        raise ValidationError(f"Échec de lecture du fichier: {exc}") from exc

    composed = extract_service.build_fact_check_message(
        extracted_text=extracted["text"],
        filename=extracted["filename"],
        user_message=message,
    )

    return await chat_service.process_chat(
        ChatRequest(
            message=composed,
            conversation_id=conversation_id,
            language=language or "fr",
        )
    )
