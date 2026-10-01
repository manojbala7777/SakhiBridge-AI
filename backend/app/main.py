import logging
import time
import uuid
from typing import Any

# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException, Request
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.responses import JSONResponse

from app.core.config import get_settings
# pyrefly: ignore [missing-import]
from app.core.security import SECURITY_HEADERS, InMemoryRateLimiter
# pyrefly: ignore [missing-import]
from app.schemas.api import ChatRequest, ChatResponse, EligibilityRequest, EligibilityResult
from app.services.conversation_service import SESSIONS, ConversationService
from app.services.eligibility_service import check_eligibility
from app.services.gemini_service import GeminiService
from app.services.scheme_service import get_scheme, list_schemes

settings = get_settings()
logging.basicConfig(level=settings.log_level)
log = logging.getLogger("sakhibridge")
limiter = InMemoryRateLimiter(settings.rate_limit_per_minute)
conversation = ConversationService(GeminiService(settings))

app = FastAPI(title="SakhiBridge AI", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.middleware("http")
async def guard(request: Request, call_next):  # type: ignore[no-untyped-def]
    rid = uuid.uuid4().hex[:8]
    start = time.perf_counter()
    client = request.client.host if request.client else "unknown"
    if not limiter.allow(client):
        return JSONResponse({"detail": "rate_limited"}, status_code=429)
    try:
        response = await call_next(request)
    except Exception as exc:
        log.error("rid=%s path=%s error=%s", rid, request.url.path, type(exc).__name__)
        return JSONResponse({"detail": "internal_error"}, status_code=500)
    response.headers.update(SECURITY_HEADERS)
    response.headers["X-Request-ID"] = rid
    log.info("rid=%s path=%s status=%s ms=%.0f", rid, request.url.path, response.status_code, (time.perf_counter() - start) * 1000)
    return response


@app.get("/api/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "demo_mode": settings.demo_mode}


@app.get("/api/schemes")
def schemes() -> list[dict[str, Any]]:
    return list_schemes()


@app.get("/api/schemes/{scheme_id}")
def scheme(scheme_id: str) -> dict[str, Any]:
    record = get_scheme(scheme_id)
    if record is None:
        raise HTTPException(404, "scheme_not_found")
    return record


@app.get("/api/schemes/{scheme_id}/documents")
def documents(scheme_id: str) -> list[dict[str, Any]]:
    record = get_scheme(scheme_id)
    if record is None:
        raise HTTPException(404, "scheme_not_found")
    return record["required_documents"]


@app.post("/api/chat", response_model=ChatResponse)
def chat(body: ChatRequest) -> dict[str, Any]:
    return conversation.handle(body.session_id, body.message, body.language)


@app.get("/api/chat/{session_id}")
def chat_session(session_id: str) -> dict[str, Any]:
    if session_id not in SESSIONS:
        raise HTTPException(404, "session_not_found")
    return {"session_id": session_id, "profile": SESSIONS[session_id]["profile"]}


@app.post("/api/eligibility/check", response_model=EligibilityResult)
def eligibility(body: EligibilityRequest) -> dict[str, Any]:
    record = get_scheme(body.scheme_id)
    if record is None:
        raise HTTPException(404, "scheme_not_found")
    profile = {k: v for k, v in body.profile.model_dump().items()}
    profile.setdefault("gender", "female")
    return check_eligibility(profile, record["eligibility_rules"])
