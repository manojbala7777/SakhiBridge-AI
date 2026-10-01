from typing import Any

ELIGIBLE = "POTENTIALLY_ELIGIBLE"
NOT_ELIGIBLE = "NOT_ELIGIBLE"
MISSING = "MISSING_INFORMATION"
VERIFY = "REQUIRES_OFFICIAL_VERIFICATION"


def check_eligibility(profile: dict[str, Any], rules: list[dict[str, Any]]) -> dict[str, Any]:
    """Deterministic rule evaluation. Rules come from scheme data, never from the AI."""
    matched: list[str] = []
    missing: list[str] = []
    failed: list[str] = []
    unsure: list[str] = []
    for rule in rules:
        value = profile.get(rule["field"])
        if value is None:
            missing.append(rule["id"])
            continue
        if rule["op"] == "gte":
            ok = isinstance(value, (int, float)) and value >= rule["value"]
        else:
            ok = value == rule["value"]
        if ok:
            matched.append(rule["id"])
        elif value in rule.get("verify_values", []):
            unsure.append(rule["id"])
        else:
            failed.append(rule["id"])
    if failed:
        status = NOT_ELIGIBLE
    elif missing:
        status = MISSING
    elif unsure:
        status = VERIFY
    else:
        status = ELIGIBLE
    return {
        "status": status,
        "matched_rules": matched,
        "missing_rules": missing + unsure + failed,
        "requires_official_verification": True,
    }
