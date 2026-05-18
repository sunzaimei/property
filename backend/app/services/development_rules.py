from __future__ import annotations
from app.models.property import PropertyRecord
from app.models.zone import DevelopmentParamsRecord, URAZoneRecord
from app.models.risk_flags import RiskFlagsRecord
from app.services.seed_loader import SeedLoader


def compute(property: PropertyRecord, zone: URAZoneRecord | None, risk_flags: RiskFlagsRecord | None) -> DevelopmentParamsRecord:
    base = SeedLoader.get_development_rules(property.property_type)
    if base is None:
        # Fallback to bungalow rules if type unknown
        base = SeedLoader.get_development_rules("bungalow")

    # Work with a mutable copy
    params = base.model_copy()

    # GCB override: tighter site coverage
    if zone and zone.is_gcba:
        params.site_coverage_pct = 40
        params.plot_ratio = 1.1

    # Compute max GFA in sqm
    if params.plot_ratio is not None:
        effective_land_sqm = property.land_area_sqm
        # If road reserve reduces usable area, adjust
        if risk_flags and risk_flags.has_road_reserve and risk_flags.road_reserve_affected_sqft:
            road_reserve_sqm = risk_flags.road_reserve_affected_sqft * 0.0929
            effective_land_sqm = max(property.land_area_sqm - road_reserve_sqm, 0)
        params.max_gfa_sqm = round(effective_land_sqm * params.plot_ratio, 1)
    else:
        params.max_gfa_sqm = None

    return params
