from __future__ import annotations
from datetime import datetime

from app.models import PropertyIntelligenceCardResponse
from app.models.property import PropertyRecord
from app.services.seed_loader import SeedLoader
from app.services import development_rules, ownership_rules


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
