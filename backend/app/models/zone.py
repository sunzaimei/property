from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class URAZoneRecord(CamelModel):
    property_id: str
    zone_code: str
    zone_label: str
    is_gcba: bool
    gcba_name: Optional[str]
    master_plan_year: int


class DevelopmentParamsRecord(CamelModel):
    max_storeys: int
    max_height_metres: float
    site_coverage_pct: int
    front_setback_metres: float
    side_setback_metres: float
    rear_setback_metres: float
    max_gfa_formula: str
    plot_ratio: Optional[float]
    notes: list[str]

    # Computed field populated by rules engine
    max_gfa_sqm: Optional[float] = None
