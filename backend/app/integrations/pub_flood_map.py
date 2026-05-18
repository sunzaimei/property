"""
PUB Flood Risk Integration Stub
================================
Purpose: Get flood risk level for a given property address or coordinates.

Sources:
  1. PUB Flood Risk Areas (public):
     URL: https://www.pub.gov.sg/drainage/floodmanagement/floodriskareas
     Format: WMS / interactive map — not directly API-accessible as of 2025
     Alternative: Request flood risk data via PUB's myENV data portal

  2. data.gov.sg (check for updated datasets):
     Search: https://data.gov.sg/search?q=flood
     Relevant: "Flood Risk Areas" polygon dataset (if published)

  3. Manual workaround for MVP+:
     Download PUB's published flood-prone area map (PDF/PNG),
     digitise flood-risk polygons in QGIS,
     export as GeoJSON and perform point-in-polygon lookup.

  4. Proxy indicator:
     Use DEM (digital elevation model) — low-lying land (<5m above sea level)
     correlates with flood risk. OneMap has terrain data.

To integrate:
  - If PUB publishes a public GeoJSON or WMS with flood risk polygons:
    Load polygons at startup, use shapely Point.within() for lookup
  - Replace risk_flags.flood_risk in seed data with live lookup
  - Map PUB zones to our severity scale: "low" | "medium" | "high"
"""


class PUBFloodMap:
    async def get_flood_risk(self, lat: float, lng: float) -> str:
        raise NotImplementedError(
            "Integrate PUB flood risk polygon data here. Returns 'low' | 'medium' | 'high'."
        )
