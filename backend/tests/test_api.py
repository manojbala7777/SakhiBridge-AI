# pyrefly: ignore [missing-import]
from fastapi.testclient import TestClient

from app.main import app
from app.services.eligibility_service import check_eligibility
from app.services.scheme_service import get_scheme

client = TestClient(app)
RULES = get_scheme("pmuy")["eligibility_rules"]  # type: ignore[index]
DEMO = {"age": 32, "gender": "female", "household_lpg_status": "none", "poor_household_status": "declared"}


def test_demo_user_potentially_eligible() -> None:
    assert check_eligibility(DEMO, RULES)["status"] == "POTENTIALLY_ELIGIBLE"


def test_missing_household_information() -> None:
    assert check_eligibility({**DEMO, "poor_household_status": None}, RULES)["status"] == "MISSING_INFORMATION"


def test_not_eligible_when_minor() -> None:
    assert check_eligibility({**DEMO, "age": 16}, RULES)["status"] == "NOT_ELIGIBLE"


def test_unsure_requires_verification() -> None:
    assert check_eligibility({**DEMO, "poor_household_status": "unsure"}, RULES)["status"] == "REQUIRES_OFFICIAL_VERIFICATION"


def test_health_and_scheme() -> None:
    assert client.get("/api/health").json()["status"] == "ok"
    assert client.get("/api/schemes/pmuy").json()["official_url"] == "https://www.pmuy.gov.in/"
    assert client.get("/api/schemes/nope").status_code == 404
    assert len(client.get("/api/schemes/pmuy/documents").json()) == 3


def test_chat_flow_one_question_at_a_time() -> None:
    r1 = client.post("/api/chat", json={"message": "எனக்கு கேஸ் சிலிண்டர் உதவி கிடைக்குமா?", "language": "ta"}).json()
    sid = r1["session_id"]
    assert "வயது" in r1["reply"]
    client.post("/api/chat", json={"session_id": sid, "message": "32", "language": "ta"})
    client.post("/api/chat", json={"session_id": sid, "message": "இல்லை", "language": "ta"})
    r4 = client.post("/api/chat", json={"session_id": sid, "message": "ஆம்", "language": "ta"}).json()
    assert r4["eligibility"]["status"] == "POTENTIALLY_ELIGIBLE"


def test_validation_rejects_empty_message() -> None:
    assert client.post("/api/chat", json={"message": ""}).status_code == 422
