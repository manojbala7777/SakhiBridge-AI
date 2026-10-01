import json
from functools import lru_cache
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


@lru_cache
def _load_all() -> dict[str, dict[str, Any]]:
    schemes: dict[str, dict[str, Any]] = {}
    for path in DATA_DIR.glob("*.json"):
        record = json.loads(path.read_text(encoding="utf-8"))
        schemes[record["scheme_id"]] = record
    return schemes


def list_schemes() -> list[dict[str, Any]]:
    return list(_load_all().values())


def get_scheme(scheme_id: str) -> dict[str, Any] | None:
    return _load_all().get(scheme_id)
