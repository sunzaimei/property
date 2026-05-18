from __future__ import annotations
from fastapi import APIRouter, HTTPException
from app.models.property import SearchResult
from app.models.transaction import TransactionRecord
from app.models import PropertyIntelligenceCardResponse
from app.services.seed_loader import SeedLoader
from app.services.property_service import build_intelligence_card
from app.config import settings
from app.integrations import onemap as onemap_integration

router = APIRouter()

# Landed property types recognised in URA data
LANDED_TYPES = {"terrace", "semi_detached", "bungalow", "gcb", "cluster", "conservation"}


@router.get("/search", response_model=list[SearchResult])
async def search_properties(q: str = ""):
    if not q.strip():
        return []

    # Use live OneMap if credentials are configured
    if settings.onemap_email and settings.onemap_password:
        try:
            live_results = await onemap_integration.search(q)
            if live_results:
                return [
                    SearchResult(
                        id=f"postal_{r['postal_code']}",
                        address=r["address"],
                        postal_code=r["postal_code"],
                        property_type="bungalow",   # unknown until full lookup; refined on card load
                        district=_postal_to_district(r["postal_code"]),
                    )
                    for r in live_results
                ]
        except Exception:
            pass  # fall through to seed search

    # Fallback: seed data search
    results = SeedLoader.search(q)
    return [
        SearchResult(
            id=p.id,
            address=p.address,
            postal_code=p.postal_code,
            property_type=p.property_type,
            district=p.district,
        )
        for p in results
    ]


@router.get("/{property_id}", response_model=PropertyIntelligenceCardResponse)
async def get_property_card(property_id: str):
    card = build_intelligence_card(property_id)
    if card is None:
        raise HTTPException(status_code=404, detail=f"Property '{property_id}' not found")
    return card


@router.get("/{property_id}/transactions", response_model=list[TransactionRecord])
async def get_transactions(property_id: str):
    if SeedLoader.get_property(property_id) is None:
        raise HTTPException(status_code=404, detail=f"Property '{property_id}' not found")
    return SeedLoader.get_transactions(property_id)


def _postal_to_district(postal_code: str) -> int:
    """Derive Singapore district from first 2 digits of postal code."""
    if len(postal_code) < 2:
        return 0
    prefix = int(postal_code[:2])
    # Singapore postal district mapping
    if prefix in range(1, 9):    return 1
    if prefix in range(9, 11):   return 2
    if prefix in range(11, 13):  return 3
    if prefix in range(13, 15):  return 4
    if prefix in range(15, 17):  return 5
    if prefix in range(17, 18):  return 6
    if prefix in range(18, 20):  return 7
    if prefix in range(20, 22):  return 8
    if prefix in range(22, 24):  return 9
    if prefix in range(24, 28):  return 10
    if prefix in range(28, 30):  return 11
    if prefix in range(30, 32):  return 12
    if prefix in range(32, 34):  return 13
    if prefix in range(34, 36):  return 14
    if prefix in range(36, 38):  return 15
    if prefix in range(38, 40):  return 16
    if prefix in range(40, 42):  return 17
    if prefix in range(42, 45):  return 18
    if prefix in range(45, 47):  return 19
    if prefix in range(47, 50):  return 20
    if prefix in range(50, 52):  return 21
    if prefix in range(52, 54):  return 22
    if prefix in range(54, 56):  return 23
    if prefix in range(56, 58):  return 24
    if prefix in range(58, 60):  return 25
    if prefix in range(60, 65):  return 26
    if prefix in range(65, 68):  return 27
    if prefix in range(68, 72):  return 28
    return 0
