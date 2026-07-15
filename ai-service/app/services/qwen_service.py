from app.core.config import Settings
from app.services.ollama_service import OllamaService


class QwenService:
    def __init__(self, settings: Settings, ollama_service: OllamaService) -> None:
        self._settings = settings
        self._ollama_service = ollama_service
        self._model = settings.ollama_model

    async def generate_response(
        self,
        prompt: str,
        system: str | None = None,
        temperature: float = 0.2,
    ) -> str:
        return await self._ollama_service.generate(
            prompt=prompt,
            model=self._model,
            system=system,
            temperature=temperature,
        )
