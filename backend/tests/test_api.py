# pyrefly: ignore [missing-import]
from fastapi.testclient import TestClient

from app.main import app
from app.services.eligibility_service import check_eligibility
from app.services.scheme_service import get_scheme


client = TestClient(app)

SCHEME_ID = "pmuy"
RULES = get_scheme(SCHEME_ID)["eligibility_rules"]  # type: ignore[index]
DEMO = {
    "age": 32,
    "gender": "female",
    "household_lpg_status": "none",
    "poor_household_status": "declared",
}


def test_demo_user_potentially_eligible() -> None:
    result = check_eligibility(DEMO, RULES)

    assert isinstance(result, dict)
    assert result["status"] == "POTENTIALLY_ELIGIBLE"


def test_missing_household_information() -> None:
    user = {**DEMO, "poor_household_status": None}

    result = check_eligibility(user, RULES)

    assert isinstance(result, dict)
    assert result["status"] == "MISSING_INFORMATION"


def test_not_eligible_when_minor() -> None:
    user = {**DEMO, "age": 16}

    result = check_eligibility(user, RULES)

    assert isinstance(result, dict)
    assert result["status"] == "NOT_ELIGIBLE"


def test_unsure_requires_verification() -> None:
    user = {**DEMO, "poor_household_status": "unsure"}

    result = check_eligibility(user, RULES)

    assert isinstance(result, dict)
    assert result["status"] == "REQUIRES_OFFICIAL_VERIFICATION"


def test_health_endpoint() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_scheme_endpoint() -> None:
    response = client.get(f"/api/schemes/{SCHEME_ID}")

    assert response.status_code == 200
    data = response.json()
    assert data["official_url"] == "https://www.pmuy.gov.in/"


def test_unknown_scheme_returns_404() -> None:
    response = client.get("/api/schemes/nope")

    assert response.status_code == 404


def test_scheme_documents() -> None:
    response = client.get(f"/api/schemes/{SCHEME_ID}/documents")

    assert response.status_code == 200
    documents = response.json()

    assert isinstance(documents, list)
    assert len(documents) == 3


def test_chat_flow_one_question_at_a_time() -> None:
    # Step 1: start a new session.
    first_response = client.post(
        "/api/chat",
        json={
            "message": "எனக்கு கேஸ் சிலிண்டர் உதவி கிடைக்குமா?",
            "language": "ta",
        },
    )

    assert first_response.status_code == 200
    first_data = first_response.json()

    assert "session_id" in first_data
    assert first_data["session_id"]
    assert "reply" in first_data
    assert "வயது" in first_data["reply"]

    session_id = first_data["session_id"]

    # Step 2: provide age.
    age_response = client.post(
        "/api/chat",
        json={
            "session_id": session_id,
            "message": "32",
            "language": "ta",
        },
    )

    assert age_response.status_code == 200
    assert "reply" in age_response.json()

    # Step 3: provide LPG status.
    lpg_response = client.post(
        "/api/chat",
        json={
            "session_id": session_id,
            "message": "இல்லை",
            "language": "ta",
        },
    )

    assert lpg_response.status_code == 200
    assert "reply" in lpg_response.json()

    # Step 4: provide household-status information and verify final result.
    final_response = client.post(
        "/api/chat",
        json={
            "session_id": session_id,
            "message": "ஆம்",
            "language": "ta",
        },
    )

    assert final_response.status_code == 200
    final_data = final_response.json()

    assert "eligibility" in final_data
    assert final_data["eligibility"]["status"] == "POTENTIALLY_ELIGIBLE"


def test_validation_rejects_empty_message() -> None:
    response = client.post("/api/chat", json={"message": ""})

    assert response.status_code == 422


def test_validation_rejects_missing_message() -> None:
    response = client.post("/api/chat", json={})

    assert response.status_code == 422
