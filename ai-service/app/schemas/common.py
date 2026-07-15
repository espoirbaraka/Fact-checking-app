from typing import Any, Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T | None = None
    message: str | None = None


class ErrorResponse(BaseModel):
    success: bool = False
    message: str


class SourceSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    title: str | None = None
    url: str | None = None
    snippet: str | None = None
    relevance_score: float | None = Field(default=None, ge=0.0, le=1.0)


class EvidenceSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    text: str
    source: SourceSchema | None = None
    relevance_score: float | None = Field(default=None, ge=0.0, le=1.0)


class ClaimSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    claim: str
    verdict: str
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: list[EvidenceSchema] = Field(default_factory=list)
    sources: list[SourceSchema] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: str = "ok"


class PaginationParams(BaseModel):
    offset: int = Field(default=0, ge=0)
    limit: int = Field(default=20, ge=1, le=100)


class DocumentCreateSchema(BaseModel):
    title: str
    content: str
    source_url: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
