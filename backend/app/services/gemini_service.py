import logging
from google import genai
# pyrefly: ignore [missing-import]
from google.genai import types
# pyrefly: ignore [missing-import]
from pydantic import ValidationError

from app.core.config import Settings
from app.schemas.api import ProfileIn

log = logging.getLogger("sakhibridge.gemini")
PROMPT = (
    "Extract facts from the user's message about a gas-connection scheme. "
    "Reply ONLY with JSON using keys age (int), gender (female|male|other), "
    "household_lpg_status (none|exists), poor_household_status (declared|not_declared|unsure). "
    "Use null when a fact is not stated. Never guess. Message: "
)


class GeminiService:
    """Backend-only Gemini access. Extracts facts; never decides eligibility."""

    def __init__(self, settings: Settings) -> None:
        self.model = settings.gemini_model
        self.enabled = bool(settings.gemini_api_key) and not settings.demo_mode
        self._client = (
            genai.Client(
                api_key=settings.gemini_api_key,
                http_options=types.HttpOptions(timeout=settings.gemini_timeout_seconds * 1000),
            )
            if self.enabled
            else None
        )

    def extract_facts(self, message: str) -> ProfileIn | None:
        if self._client is None:
            return None
        for _ in range(2):
            try:
                resp = self._client.models.generate_content(
                    model=self.model,
                    contents=PROMPT + message,
                    config=types.GenerateContentConfig(response_mime_type="application/json", temperature=0),
                )
                return ProfileIn.model_validate_json(resp.text or "")
            except ValidationError:
                log.warning("gemini returned malformed facts")
            except Exception as exc:  # network/API failure: fall back to deterministic parsing
                log.warning("gemini unavailable: %s", type(exc).__name__)
                return None
        return None
