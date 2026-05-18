from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class TransactionRecord(CamelModel):
    id: str
    property_id: str
    transaction_date: str
    sale_price: int
    land_area_sqft: float
    built_up_sqft: Optional[float]
    psf_land: int
    psf_built_up: Optional[int]
    buyer_type: str
    project_name: Optional[str]
    tenure: str
