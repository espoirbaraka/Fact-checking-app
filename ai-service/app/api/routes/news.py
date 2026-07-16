from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.api.dependencies import get_news_service
from app.core.security import verify_api_key
from app.services.news_service import NewsService

router = APIRouter(prefix="/news", tags=["news"])


@router.get(
    "/nord-kivu",
    dependencies=[Depends(verify_api_key)],
)
async def nord_kivu_news(
    news_service: Annotated[NewsService, Depends(get_news_service)],
    limit: int = Query(default=12, ge=1, le=24),
) -> dict:
    items = await news_service.get_nord_kivu_news(limit=limit)
    return {"items": items, "count": len(items)}
