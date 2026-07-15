from pydantic import BaseModel, Field

from app.schemas.common import ClaimSchema


class FactCheckRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000)


class FactCheckResponse(BaseModel):
    claims: list[ClaimSchema]
