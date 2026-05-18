from __future__ import annotations
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ABSDRate(CamelModel):
    buyer_profile: str
    rate_percent: int
    notes: str | None


class OwnershipRules(CamelModel):
    sc_eligible: bool
    pr_eligible: bool
    foreigner_eligible: bool
    foreigner_restrictions: str | None
    company_eligible: bool
    absd_rates: list[ABSDRate]
    bsd_note: str
    requires_land_deal_approval: bool
    special_conditions: list[str]
