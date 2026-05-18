from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class RiskFlagsRecord(CamelModel):
    property_id: str
    flood_risk: str  # low | medium | high
    flood_risk_source: str
    is_tree_conservation_area: bool
    tree_conservation_notes: Optional[str]
    is_conservation_property: bool
    conservation_grade: Optional[str]
    conservation_authority: Optional[str]
    has_road_reserve: bool
    road_reserve_affected_sqft: Optional[int]
    road_reserve_notes: Optional[str]
