from pydantic import BaseModel, Field

from app.schemas.common import ClaimSchema


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000)
    conversation_id: str | None = None
    language: str = Field(default="fr", max_length=16)


class ChatResponse(BaseModel):
    answer: str
    confidence: float = Field(ge=0.0, le=1.0)
    sources: list[dict] = Field(default_factory=list)
    claims: list[ClaimSchema] = Field(default_factory=list)
