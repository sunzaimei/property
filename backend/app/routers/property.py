from __future__ import annotations
from fastapi import APIRouter, HTTPException
from app.models.property import SearchResult
from app.models.transaction import TransactionRecord
from app.models import PropertyIntelligenceCardResponse
from app.services.seed_loader import SeedLoader
from app.services.property_service import build_intelligence_card, build_intelligence_card_from_postal
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
                        lat=r["lat"],
                        lng=r["lng"],
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
            lat=p.coordinates.lat,
            lng=p.coordinates.lng,
        )
        for p in results
    ]


@router.get("/{property_id}", response_model=PropertyIntelligenceCardResponse)
async def get_property_card(property_id: str, address: str = "", lat: float = 0.0, lng: float = 0.0):
    if property_id.startswith("postal_"):
        postal_code = property_id.removeprefix("postal_")
        card = await build_intelligence_card_from_postal(
            postal_code=postal_code,
            address=address,
            lat=lat,
            lng=lng,
            district=_postal_to_district(postal_code),
        )
        return card

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
    """Derive Singapore district from first 2 digits of postal code.
    Source: URA List of Postal Districts (SingPost)
    https://www.ura.gov.sg/Corporate/-/media/Corporate/Property/PMI-Online/List_Of_Postal_Districts.pdf
    """
    if len(postal_code) < 2:
        return 0
    prefix = int(postal_code[:2])
    _MAP = {
        1:  [1, 2, 3, 4, 5, 6],
        2:  [7, 8],
        3:  [14, 15, 16],
        4:  [9, 10],
        5:  [11, 12, 13],
        6:  [17],
        7:  [18, 19],
        8:  [20, 21],
        9:  [22, 23],
        10: [24, 25, 26, 27],
        11: [28, 29, 30],
        12: [31, 32, 33],
        13: [34, 35, 36, 37],
        14: [38, 39, 40, 41],
        15: [42, 43, 44, 45],
        16: [46, 47, 48],
        17: [49, 50, 81],
        18: [51, 52],
        19: [53, 54, 55, 82],
        20: [56, 57],
        21: [58, 59],
        22: [60, 61, 62, 63, 64],
        23: [65, 66, 67, 68],
        24: [69, 70, 71],
        25: [72, 73],
        26: [77, 78],
        27: [75, 76],
        28: [79, 80],
    }
    for district, sectors in _MAP.items():
        if prefix in sectors:
            return district
    return 0


def _postal_to_district(postal_code: str) -> int:
    """Derive Singapore district from first 2 digits of postal code.
    Source: URA List of Postal Districts (SingPost)
    https://www.ura.gov.sg/Corporate/-/media/Corporate/Property/PMI-Online/List_Of_Postal_Districts.pdf
    """
    if len(postal_code) < 2:
        return 0
    prefix = int(postal_code[:2])
    _MAP = {
        1:  [1, 2, 3, 4, 5, 6],
        2:  [7, 8],
        3:  [14, 15, 16],
        4:  [9, 10],
        5:  [11, 12, 13],
        6:  [17],
        7:  [18, 19],
        8:  [20, 21],
        9:  [22, 23],
        10: [24, 25, 26, 27],
        11: [28, 29, 30],
        12: [31, 32, 33],
        13: [34, 35, 36, 37],
        14: [38, 39, 40, 41],
        15: [42, 43, 44, 45],
        16: [46, 47, 48],
        17: [49, 50, 81],
        18: [51, 52],
        19: [53, 54, 55, 82],
        20: [56, 57],
        21: [58, 59],
        22: [60, 61, 62, 63, 64],
        23: [65, 66, 67, 68],
        24: [69, 70, 71],
        25: [72, 73],
        26: [77, 78],
        27: [75, 76],
        28: [79, 80],
    }
    for district, sectors in _MAP.items():
        if prefix in sectors:
            return district
    return 0
