from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from app.models.property import PropertyRecord, SearchResult
from app.models.transaction import TransactionRecord
from app.models.zone import URAZoneRecord, DevelopmentParamsRecord
from app.models.risk_flags import RiskFlagsRecord
from app.models.ownership import OwnershipRules


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class PropertyIntelligenceCardResponse(CamelModel):
    property: PropertyRecord
    ura_zone: URAZoneRecord
    development_params: DevelopmentParamsRecord
    transactions: list[TransactionRecord]
    risk_flags: RiskFlagsRecord
    ownership_rules: OwnershipRules
    last_updated: str
