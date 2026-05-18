"""
OneMap Geocoding — live implementation
Auth token is valid for 3 days; cached in module-level variable and refreshed on expiry.
"""
from __future__ import annotations
import time
import httpx
from app.config import settings

_token: str | None = None
_token_expiry: float = 0.0


async def _get_token() -> str:
    global _token, _token_expiry
    if _token and time.time() < _token_expiry:
        return _token

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://www.onemap.gov.sg/api/auth/post/getToken",
            json={"email": settings.onemap_email, "password": settings.onemap_password},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        _token = data["access_token"]
        # Token valid 3 days; refresh after 2.5 days to be safe
        _token_expiry = time.time() + 2.5 * 86400
        return _token


async def search(query: str, limit: int = 5) -> list[dict]:
    """
    Returns list of dicts with keys:
      address, postal_code, lat, lng, block, road_name
    """
    if not settings.onemap_email or not settings.onemap_password:
        return []

    token = await _get_token()

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://www.onemap.gov.sg/api/common/elastic/search",
            params={
                "searchVal": query,
                "returnGeom": "Y",
                "getAddrDetails": "Y",
                "pageNum": 1,
            },
            headers={"Authorization": f"Bearer {token}"},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()

    results = []
    for r in data.get("results", [])[:limit]:
        postal = r.get("POSTAL", "")
        if postal in ("NIL", "", None):
            continue
        results.append({
            "address": r.get("ADDRESS", ""),
            "postal_code": postal,
            "lat": float(r.get("LATITUDE", 0)),
            "lng": float(r.get("LONGITUDE", 0)),
            "block": r.get("BLK_NO", ""),
            "road_name": r.get("ROAD_NAME", ""),
        })
    return results
