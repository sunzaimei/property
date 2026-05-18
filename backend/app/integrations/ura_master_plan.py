"""
URA Master Plan Integration Stub
==================================
Purpose: Get URA zone + GCBA status for a given lat/lng coordinate.

Option A — URA API (preferred, more accurate):
  Register: https://eservice.ura.gov.sg/maps/api/reg.html
  Token: GET https://www.ura.gov.sg/uraDataService/insertNewToken.action?service=token&accessKey={key}
  Endpoint: GET https://www.ura.gov.sg/uraDataService/invokeUraDS
    ?service=PMI_Comm_MasterPlan&year=2019&token={token}
  Returns GeoJSON polygons for all Master Plan zones.
  Perform a point-in-polygon lookup using shapely: pip install shapely

Option B — data.gov.sg GeoJSON download (simpler, works offline):
  Dataset: URA Master Plan 2019 Land Use (GEOJSON)
  URL: https://data.gov.sg/dataset/master-plan-2019-land-use-layer
  Download once, store as data/ura_masterplan.geojson
  Use shapely.geometry.Point.within() for lookup

GCB Area boundaries:
  39 GCBA boundaries are part of the Master Plan SDCPs.
  The GCBA polygon layer can be extracted from the Master Plan GeoJSON
  where LU_DESC == "RESIDENTIAL" and SDCP records indicate GCB areas.
  Alternatively, digitise from URA's published PDF maps of the 39 GCBAs.

To integrate:
  1. Obtain URA Access Key (free, registration required)
  2. Download / cache the Master Plan GeoJSON
  3. On startup, load GeoJSON polygons into memory
  4. Replace SeedLoader.get_ura_zone() in property_service.py with
     URAMasterPlan.get_zone(lat, lng)
"""

from app.models.zone import URAZoneRecord


class URAMasterPlan:
    async def get_zone(self, lat: float, lng: float) -> URAZoneRecord | None:
        raise NotImplementedError(
            "Integrate URA Master Plan GeoJSON and point-in-polygon lookup (shapely) here"
        )
