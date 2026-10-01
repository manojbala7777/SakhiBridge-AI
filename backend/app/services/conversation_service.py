import re
import uuid
from typing import Any

from app.services.eligibility_service import ELIGIBLE, MISSING, NOT_ELIGIBLE, VERIFY, check_eligibility
from app.services.gemini_service import GeminiService
from app.services.scheme_service import get_scheme

FIELD_ORDER = ["age", "household_lpg_status", "poor_household_status"]
QUESTIONS = {
    "age": {"ta": "உங்கள் வயது எவ்வளவு?", "en": "How old are you?"},
    "household_lpg_status": {"ta": "உங்கள் வீட்டில் ஏற்கனவே LPG கேஸ் இணைப்பு உள்ளதா? (ஆம் / இல்லை)", "en": "Does your home already have an LPG gas connection? (yes / no)"},
    "poor_household_status": {"ta": "உங்கள் குடும்பம் ஏழைக் குடும்பம் என்று நீங்கள் கூறுகிறீர்களா? (ஆம் / இல்லை / தெரியாது)", "en": "Do you declare that your household is a poor household? (yes / no / not sure)"},
}
INTRO = {
    "ta": "கண்டிப்பாக. உங்களுக்கு உஜ்வலா திட்டம் பொருந்துமா என்பதைப் பார்க்க சில எளிய கேள்விகள் கேட்கிறேன்.",
    "en": "Of course. I will ask a few simple questions to see if the Ujjwala scheme may suit you.",
}
REPEAT = {"ta": "மன்னிக்கவும், புரியவில்லை. மீண்டும் சொல்லுங்கள்.", "en": "Sorry, I did not understand. Please say it again."}
DISCLAIMER = {
    "ta": "நீங்கள் தந்த தகவல்களின் அடிப்படையில், பட்டியலிடப்பட்ட நிபந்தனைகளை நீங்கள் பூர்த்தி செய்யலாம். இறுதி தகுதி அதிகாரப்பூர்வ அரசு நடைமுறையில்தான் முடிவு செய்யப்படும்.",
    "en": "Based on the information you provided, you may meet the listed criteria. Final eligibility is determined through the official government process.",
}
OUTCOME = {
    NOT_ELIGIBLE: {"ta": "நீங்கள் தந்த தகவலின்படி, பட்டியலிடப்பட்ட ஒரு நிபந்தனையை நீங்கள் பூர்த்தி செய்யவில்லை. அதிகாரப்பூர்வ தளத்தில் உறுதிசெய்யுங்கள்.", "en": "From what you told me, one listed criterion is not met. Please confirm on the official site."},
    VERIFY: {"ta": "இந்த தகவலை உறுதியாகச் சொல்ல முடியவில்லை. அதிகாரப்பூர்வ தகவலை சரிபார்க்கவும்.", "en": "I cannot say this for certain. Please check the official information."},
    MISSING: {"ta": "இன்னும் சில தகவல்கள் தேவை.", "en": "I still need some information."},
}
YES = ("ஆம்", "உண்டு", "உள்ளது", "yes", "y")
NO = ("இல்லை", "இல்ல", "no", "n")
UNSURE = ("தெரியாது", "தெரியலை", "not sure", "dont know", "don't know")
_TAMIL_DIGITS = str.maketrans("௦௧௨௩௪௫௬௭௮௯", "0123456789")
SESSIONS: dict[str, dict[str, Any]] = {}


def _has(text: str, words: tuple[str, ...]) -> bool:
    return any(w in text for w in words)


def parse_answer(field: str, message: str) -> Any:
    text = message.strip().lower().translate(_TAMIL_DIGITS)
    if field == "age":
        m = re.search(r"\d{1,3}", text)
        return int(m.group()) if m and 0 < int(m.group()) <= 120 else None
    if _has(text, UNSURE):
        return "unsure" if field == "poor_household_status" else None
    if field == "household_lpg_status":
        return "none" if _has(text, NO) else "exists" if _has(text, YES) else None
    if field == "poor_household_status":
        return "not_declared" if _has(text, NO) else "declared" if _has(text, YES) else None
    return None


class ConversationService:
    def __init__(self, gemini: GeminiService) -> None:
        self.gemini = gemini

    def handle(self, session_id: str | None, message: str, lang: str) -> dict[str, Any]:
        sid = session_id if session_id in SESSIONS else uuid.uuid4().hex
        is_new = sid not in SESSIONS
        s = SESSIONS.setdefault(sid, {"profile": {"gender": "female"}, "asking": None})
        profile = s["profile"]
        parts: list[str] = []
        facts = self.gemini.extract_facts(message)
        if facts:
            profile.update({k: v for k, v in facts.model_dump().items() if v is not None and k != "gender"})
        elif s["asking"]:
            value = parse_answer(s["asking"], message)
            if value is None:
                return self._reply(sid, [REPEAT[lang], QUESTIONS[s["asking"]][lang]], profile, "understand", None)
            profile[s["asking"]] = value
        if is_new:
            parts.append(INTRO[lang])
        missing = [f for f in FIELD_ORDER if profile.get(f) is None]
        if missing:
            s["asking"] = missing[0]
            parts.append(QUESTIONS[missing[0]][lang])
            return self._reply(sid, parts, profile, "understand", None)
        s["asking"] = None
        scheme = get_scheme("pmuy") or {}
        result = check_eligibility(profile, scheme.get("eligibility_rules", []))
        parts.append(DISCLAIMER[lang] if result["status"] == ELIGIBLE else OUTCOME.get(result["status"], OUTCOME[VERIFY])[lang])
        return self._reply(sid, parts, profile, "eligibility", result)

    @staticmethod
    def _reply(sid: str, parts: list[str], profile: dict[str, Any], step: str, elig: dict[str, Any] | None) -> dict[str, Any]:
        return {"session_id": sid, "reply": "\n".join(parts), "profile": profile, "current_step": step, "eligibility": elig}
