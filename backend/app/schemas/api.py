from typing import Any, Literal
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field

Lang = Literal["ta", "en", "hi", "te", "ml", "kn"]


class ProfileIn(BaseModel):
    age: int | None = Field(default=None, ge=0, le=120)
    gender: Literal["female", "male", "other"] | None = None
    household_lpg_status: Literal["none", "exists"] | None = None
    poor_household_status: Literal["declared", "not_declared", "unsure"] | None = None


class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str = Field(min_length=1, max_length=500)
    language: Lang = "ta"


class EligibilityResult(BaseModel):
    status: str
    matched_rules: list[str]
    missing_rules: list[str]
    requires_official_verification: bool


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    profile: dict[str, Any]
    current_step: str
    eligibility: EligibilityResult | None = None


class EligibilityRequest(BaseModel):
    scheme_id: str = "pmuy"
    profile: ProfileIn
