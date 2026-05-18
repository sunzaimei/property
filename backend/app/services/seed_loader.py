from __future__ import annotations
import json
from pathlib import Path

from app.models.property import PropertyRecord
from app.models.transaction import TransactionRecord
from app.models.zone import URAZoneRecord, DevelopmentParamsRecord
from app.models.risk_flags import RiskFlagsRecord


class SeedStore:
    properties: dict[str, PropertyRecord] = {}
    ura_zones: dict[str, URAZoneRecord] = {}
    risk_flags: dict[str, RiskFlagsRecord] = {}
    transactions: dict[str, list[TransactionRecord]] = {}
    development_rules: dict[str, DevelopmentParamsRecord] = {}


class SeedLoader:
    @classmethod
    def load(cls) -> None:
        from app.config import settings
        data_dir: Path = settings.data_dir

        # Properties
        props_raw = json.loads((data_dir / "properties.json").read_text())
        for p in props_raw:
            record = PropertyRecord.model_validate(p)
            SeedStore.properties[record.id] = record

        # URA Zones
        zones_raw = json.loads((data_dir / "ura_zones.json").read_text())
        for z in zones_raw:
            record = URAZoneRecord.model_validate(z)
            SeedStore.ura_zones[record.property_id] = record

        # Risk Flags
        flags_raw = json.loads((data_dir / "risk_flags.json").read_text())
        for f in flags_raw:
            record = RiskFlagsRecord.model_validate(f)
            SeedStore.risk_flags[record.property_id] = record

        # Transactions — indexed by property_id
        txns_raw = json.loads((data_dir / "transactions.json").read_text())
        for t in txns_raw:
            record = TransactionRecord.model_validate(t)
            SeedStore.transactions.setdefault(record.property_id, []).append(record)
        # Sort each property's transactions newest first
        for pid in SeedStore.transactions:
            SeedStore.transactions[pid].sort(key=lambda x: x.transaction_date, reverse=True)

        # Development Rules — keyed by property_type
        rules_raw = json.loads((data_dir / "development_rules.json").read_text())
        for prop_type, rule in rules_raw.items():
            SeedStore.development_rules[prop_type] = DevelopmentParamsRecord.model_validate(rule)

    @classmethod
    def get_property(cls, property_id: str) -> PropertyRecord | None:
        return SeedStore.properties.get(property_id)

    @classmethod
    def search(cls, query: str, limit: int = 5) -> list[PropertyRecord]:
        q = query.lower().strip()
        if not q:
            return []
        results = [
            p for p in SeedStore.properties.values()
            if q in p.address.lower() or q in p.street_name.lower() or q in p.postal_code
        ]
        return results[:limit]

    @classmethod
    def get_ura_zone(cls, property_id: str) -> URAZoneRecord | None:
        return SeedStore.ura_zones.get(property_id)

    @classmethod
    def get_risk_flags(cls, property_id: str) -> RiskFlagsRecord | None:
        return SeedStore.risk_flags.get(property_id)

    @classmethod
    def get_transactions(cls, property_id: str) -> list[TransactionRecord]:
        return SeedStore.transactions.get(property_id, [])

    @classmethod
    def get_development_rules(cls, property_type: str) -> DevelopmentParamsRecord | None:
        return SeedStore.development_rules.get(property_type)
