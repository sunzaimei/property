from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class Coordinates(CamelModel):
    lat: float
    lng: float


class PropertyRecord(CamelModel):
    id: str
    address: str
    postal_code: str
    district: int
    property_type: str
    tenure: str
    land_area_sqft: float
    land_area_sqm: float
    built_up_sqft: Optional[float]
    built_up_sqm: Optional[float]
    coordinates: Coordinates
    street_name: str
    unit_number: Optional[str]


class SearchResult(CamelModel):
    id: str
    address: str
    postal_code: str
    property_type: str
    district: int
