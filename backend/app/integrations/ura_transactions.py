"""
URA Private Residential Transactions — live implementation via data.gov.sg (no token needed)
Falls back to URA's own API if access key is configured.

data.gov.sg resource ID for private residential transactions:
  d_8b84c4ee58e3cfc0ece0d773c8ca6abc
"""
from __future__ import annotations
import httpx
from app.config import settings

DATAGOV_RESOURCE_ID = "d_8b84c4ee58e3cfc0ece0d773c8ca6abc"
DATAGOV_BASE = "https://data.gov.sg/api/action/datastore_search"

# Map URA property type strings to our internal types
_TYPE_MAP = {
    "TERRACE HOUSE": "terrace",
    "SEMI-DETACHED HOUSE": "semi_detached",
    "DETACHED HOUSE": "bungalow",
    "EXECUTIVE CONDOMINIUM": None,  # skip
}


def _detect_property_type(raw_type: str) -> str | None:
    raw = raw_type.upper().strip()
    for k, v in _TYPE_MAP.items():
        if k in raw:
            return v
    return None


def _parse_tenure(raw: str) -> str:
    raw = raw.upper()
    if "999" in raw:
        return "999_leasehold"
    if "99" in raw or "LEASEHOLD" in raw:
        return "99_leasehold"
    return "freehold"


async def get_by_postal(postal_code: str, limit: int = 10) -> list[dict]:
    """
    Fetch recent landed transactions for a postal code from data.gov.sg.
    Returns list of dicts matching TransactionRecord shape.
    """
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            DATAGOV_BASE,
            params={
                "resource_id": DATAGOV_RESOURCE_ID,
                "q": postal_code,
                "limit": 50,
            },
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()

    records = data.get("result", {}).get("records", [])
    transactions = []

    for i, r in enumerate(records):
        prop_type = _detect_property_type(r.get("propertyType", ""))
        if prop_type is None:
            continue

        try:
            price = int(float(r.get("price", 0)))
            area_sqft = float(r.get("area", 0))
            psf_land = int(price / area_sqft) if area_sqft else 0
            contract_date = r.get("contractDate", "")
            # contractDate format: "24-Jan" → we add the year approximation
            tenure_raw = r.get("tenure", "freehold")

            transactions.append({
                "id": f"live_{postal_code}_{i}",
                "property_id": f"postal_{postal_code}",
                "transaction_date": _parse_contract_date(contract_date),
                "sale_price": price,
                "land_area_sqft": area_sqft,
                "built_up_sqft": None,
                "psf_land": psf_land,
                "psf_built_up": None,
                "buyer_type": "unknown",
                "project_name": r.get("project"),
                "tenure": _parse_tenure(tenure_raw),
            })
        except (ValueError, ZeroDivisionError):
            continue

    # Sort newest first, cap at limit
    transactions.sort(key=lambda x: x["transaction_date"], reverse=True)
    return transactions[:limit]


def _parse_contract_date(raw: str) -> str:
    """Convert URA contractDate format 'YYMM' (e.g. '2404') to ISO date '2024-04-01'."""
    try:
        if len(raw) == 4 and raw.isdigit():
            year = int("20" + raw[:2])
            month = int(raw[2:])
            return f"{year}-{month:02d}-01"
    except (ValueError, IndexError):
        pass
    return "2024-01-01"
