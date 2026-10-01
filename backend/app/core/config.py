from functools import lru_cache
# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    app_env: str = "development"
    demo_mode: bool = True
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    cors_origins: str = "http://localhost:5173"
    log_level: str = "INFO"
    rate_limit_per_minute: int = 60
    gemini_timeout_seconds: int = 10

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
