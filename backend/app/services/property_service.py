from __future__ import annotations
from datetime import datetime

from app.models import PropertyIntelligenceCardResponse
from app.models.property import PropertyRecord, Coordinates
from app.models.zone import URAZoneRecord
from app.models.risk_flags import RiskFlagsRecord
from app.models.transaction import TransactionRecord
from app.services.seed_loader import SeedLoader
from app.services import development_rules, ownership_rules
from app.integrations import ura_transactions


def build_intelligence_card(property_id: str) -> PropertyIntelligenceCardResponse | None:
    prop = SeedLoader.get_property(property_id)
    if prop is None:
        return None

    zone = SeedLoader.get_ura_zone(property_id)
    risk = SeedLoader.get_risk_flags(property_id)
    transactions = SeedLoader.get_transactions(property_id)
    dev_params = development_rules.compute(prop, zone, risk)
    ownership = ownership_rules.compute(prop, zone)

    return PropertyIntelligenceCardResponse(
        property=prop,
        ura_zone=zone,
        development_params=dev_params,
        transactions=transactions,
        risk_flags=risk,
        ownership_rules=ownership,
        last_updated=datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
    )


async def build_intelligence_card_from_postal(
    postal_code: str,
    address: str,
    lat: float,
    lng: float,
    district: int,
) -> PropertyIntelligenceCardResponse:
    property_id = f"postal_{postal_code}"

    # Fetch live transactions first — use them to infer property type and tenure
    raw_txns = await ura_transactions.get_by_postal(postal_code)
    transactions = [TransactionRecord(**t) for t in raw_txns]

    # Infer property type and tenure from transactions if available
    property_type = "bungalow"
    tenure = "freehold"
    land_area_sqft = 0.0
    if transactions:
        first = raw_txns[0]
        if first.get("tenure"):
            tenure = first["tenure"]
        # Use average land area from transactions as estimate
        areas = [t["land_area_sqft"] for t in raw_txns if t.get("land_area_sqft")]
        if areas:
            land_area_sqft = sum(areas) / len(areas)

    prop = PropertyRecord(
        id=property_id,
        address=address or f"Postal Code {postal_code}",
        postal_code=postal_code,
        district=district,
        property_type=property_type,
        tenure=tenure,
        land_area_sqft=land_area_sqft,
        land_area_sqm=round(land_area_sqft * 0.0929, 1),
        built_up_sqft=None,
        built_up_sqm=None,
        coordinates=Coordinates(lat=lat, lng=lng),
        street_name=address or postal_code,
        unit_number=None,
    )

    zone = URAZoneRecord(
        property_id=property_id,
        zone_code="RESIDENTIAL",
        zone_label="Residential (zone lookup requires URA API key)",
        is_gcba=False,
        gcba_name=None,
        master_plan_year=2019,
    )

    risk = RiskFlagsRecord(
        property_id=property_id,
        flood_risk="low",
        flood_risk_source="Live data not available — enable PUB integration",
        is_tree_conservation_area=False,
        tree_conservation_notes=None,
        is_conservation_property=False,
        conservation_grade=None,
        conservation_authority=None,
        has_road_reserve=False,
        road_reserve_affected_sqft=None,
        road_reserve_notes=None,
    )

    dev_params = development_rules.compute(prop, zone, risk)
    ownership = ownership_rules.compute(prop, zone)

    return PropertyIntelligenceCardResponse(
        property=prop,
        ura_zone=zone,
        development_params=dev_params,
        transactions=transactions,
        risk_flags=risk,
        ownership_rules=ownership,
        last_updated=datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
    )
