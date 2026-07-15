from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import get_fact_check_service
from app.core.security import verify_api_key
from app.schemas.fact_check import FactCheckRequest, FactCheckResponse
from app.services.fact_check_service import FactCheckService

router = APIRouter(prefix="/fact-check", tags=["fact-check"])


@router.post(
    "",
    response_model=FactCheckResponse,
    dependencies=[Depends(verify_api_key)],
)
async def fact_check(
    request: FactCheckRequest,
    fact_check_service: Annotated[FactCheckService, Depends(get_fact_check_service)],
) -> FactCheckResponse:
    claims = await fact_check_service.fact_check_text(request.text)
    return FactCheckResponse(claims=claims)
