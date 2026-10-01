# SakhiBridge AI — "Speak. Understand. Access."

Voice-first Tamil assistant that guides a first-time woman user through the Pradhan Mantri Ujjwala Yojana (PMUY): ask, check the listed criteria, prepare documents, then go to the official PMUY site.
It is AI guidance only, never a government decision. Scheme data lives in `backend/app/data/pmuy.json` (set `last_verified` after checking https://www.pmuy.gov.in/).

## Run (Node 22, Python 3.13 recommended)

Backend (Windows: `.venv\Scripts\activate`):

    cd backend
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env
    uvicorn app.main:app --reload --port 8000
    pytest

Frontend:

    cd frontend
    cp .env.example .env
    npm install
    npm run dev        # http://localhost:5173
    npm run build

API docs: http://localhost:8000/docs and /redoc.

## Demo mode
`DEMO_MODE=true` (default) needs no Gemini key or database: a deterministic Tamil/English question flow, with the deterministic rule engine deciding eligibility.
To use Gemini, set `DEMO_MODE=false` and `GEMINI_API_KEY` in `backend/.env` only. The key never reaches the browser. Gemini only extracts facts (validated with Pydantic, falls back on failure) and never decides eligibility.

## Privacy
No Aadhaar, bank numbers, OTPs or passwords are collected. Sessions are held in memory only.

## Not included yet
PostgreSQL/Alembic, Qdrant RAG, `/api/chat/voice`, applications and profile endpoints, admin page, frontend tests, Docker, CI. Deferred, not stubbed.
