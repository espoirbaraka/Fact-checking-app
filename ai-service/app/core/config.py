from functools import lru_cache
from typing import Literal

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = Field(default="ai-fact-checking-service", alias="APP_NAME")
    app_env: Literal["development", "staging", "production"] = Field(
        default="development",
        alias="APP_ENV",
    )
    app_port: int = Field(default=8000, alias="APP_PORT")

    database_host: str = Field(default="localhost", alias="DATABASE_HOST")
    database_port: int = Field(default=5432, alias="DATABASE_PORT")
    database_user: str = Field(default="postgres", alias="DATABASE_USER")
    database_password: str = Field(default="postgres", alias="DATABASE_PASSWORD")
    database_name: str = Field(default="fact_checking", alias="DATABASE_NAME")

    ollama_url: str = Field(default="http://localhost:11434", alias="OLLAMA_URL")
    ollama_model: str = Field(default="qwen2.5:7b", alias="OLLAMA_MODEL")  # prefer 7b+ for accuracy
    ollama_fallback_model: str | None = Field(default="qwen2.5:3b", alias="OLLAMA_FALLBACK_MODEL")

    embedding_model: str = Field(
        default="sentence-transformers/all-MiniLM-L6-v2",
        alias="EMBEDDING_MODEL",
    )
    embedding_dimension: int = Field(default=384)

    openfactcheck_enabled: bool = Field(default=False, alias="OPENFACTCHECK_ENABLED")

    api_key: str | None = Field(default=None, alias="API_KEY")
    web_research_enabled: bool = Field(default=True, alias="WEB_RESEARCH_ENABLED")
    web_research_max_results: int = Field(default=6, alias="WEB_RESEARCH_MAX_RESULTS")
    trusted_source_domains: str = Field(
        default=(
            "radiookapi.net,rfi.fr,france24.com,tv5monde.com,rtnc.cd,"
            "actualite.cd,mediacongo.net,reuters.com,apnews.com,bbc.com,afp.com"
        ),
        alias="TRUSTED_SOURCE_DOMAINS",
    )
    cors_origins: str = Field(
        default="http://localhost:3000,http://localhost:4000",
        alias="CORS_ORIGINS",
    )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.database_user}:{self.database_password}"
            f"@{self.database_host}:{self.database_port}/{self.database_name}"
        )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @computed_field  # type: ignore[prop-decorator]
    @property
    def trusted_domains(self) -> list[str]:
        return [
            domain.strip().lower()
            for domain in self.trusted_source_domains.split(",")
            if domain.strip()
        ]

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
