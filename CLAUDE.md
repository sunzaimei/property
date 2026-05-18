# LandedIQ

Singapore landed property due diligence platform. Enter any address and get an instant Intelligence Card with URA zone, development parameters, transaction PSF history, ownership eligibility, and risk flags.

---

## Table of Contents

1. [Product Vision & Design Process](#1-product-vision--design-process)
2. [Market Research Findings](#2-market-research-findings)
3. [Architecture Decisions](#3-architecture-decisions)
4. [Project Structure](#4-project-structure)
5. [Running Locally](#5-running-locally)
6. [Backend Reference](#6-backend-reference)
7. [Frontend Reference](#7-frontend-reference)
8. [Seed Data](#8-seed-data)
9. [API Credentials — Step by Step](#9-api-credentials--step-by-step)
10. [Live API Integration Status](#10-live-api-integration-status)
11. [Environment Variables](#11-environment-variables)
12. [Roadmap](#12-roadmap)

---

## 1. Product Vision & Design Process

### The Problem

Buying a landed property in Singapore involves weeks of fragmented due diligence. Before a buyer can decide whether to exercise their OTP (typically a 14-day window), they need to:

1. Check if the property is inside a GCB Area — requires manually navigating the URA Master Plan interactive map
2. Understand what they can build — requires reading 3 separate URA Development Control PDF handbooks
3. Check for road reserves eating into usable land — requires calling LTA or hiring a surveyor
4. Estimate rebuild cost — requires hiring an architect for a feasibility study (SGD 3K–10K) before OTP is even exercised
5. Check ownership eligibility as a PR or foreigner — requires hiring a lawyer
6. Assess flood risk — PUB data is not publicly mapped at property level
7. Check tree conservation restrictions — requires calling NParks
8. Get a normalised PSF comparison (land vs built-up) — no platform does this consistently

No existing platform brings this together. PropertyGuru, 99.co, SRX, EdgeProp, and every agency portal were built for condominiums and adapted for landed as an afterthought.

### Design Process

**Step 1 — Market research**

Surveyed all current Singapore property platforms:
- Tier 1 portals: PropertyGuru (9,005+ landed listings), 99.co (6,644+), SRX, EdgeProp
- Tier 2 agency sites: PropNex, ERA, OrangeTee, Huttons
- Data platforms: SquareFoot Research, The Landed Collective
- Government: URA, SLA OneMap, data.gov.sg, CEA, PUB

Findings: every platform has the same gap — listing search and basic AVM, but no planning data, no development feasibility, no risk flag aggregation.

**Step 2 — Niche identification**

Landed property is only ~5% of Singapore households, so large portals don't prioritise it. The complexity (GCB rules, setbacks, road reserves, LBC charges) is high enough that agents use it to justify fees. All underlying data is publicly available from government sources — nobody has stitched it together for consumers.

**Step 3 — MVP scoping**

Chose the narrowest high-value starting point: **address → instant Intelligence Card**. A 2-minute lookup replacing what currently takes days. The card covers:

| Panel | Data source |
|-------|------------|
| URA Zone + GCB Area status | URA Master Plan (seed → live API) |
| Development parameters | URA DC Handbook rules engine (computed) |
| Transaction PSF history | URA transactions (seed → data.gov.sg API) |
| Ownership eligibility + ABSD | Rules engine (hardcoded, accurate) |
| Risk flags | Seed data (→ PUB, NParks, LTA live APIs) |

**Step 4 — Stack selection**

- Next.js 16 (App Router) + TypeScript + Tailwind — map-capable, fast SSR for card page
- FastAPI + Python 3.11 — rules engine is easiest in Python; clean async for external API calls
- react-leaflet + OpenStreetMap — free, no API key, renders Singapore tiles accurately
- JSON seed files — no database for MVP; in-memory store at startup; swap to live APIs one method at a time

**Step 5 — Build sequence**

1. Seed data (10 representative properties covering all landed types)
2. Rules engines (development params, ownership eligibility) — these are accurate immediately, no API needed
3. FastAPI endpoints with camelCase Pydantic models matching TypeScript interfaces
4. Frontend components bottom-up: UI primitives → search → card panels → pages
5. Live API integrations wired in progressively (OneMap first, then URA transactions)

---

## 2. Market Research Findings

### What exists

| Platform | Type | Landed-specific features |
|----------|------|--------------------------|
| PropertyGuru | Portal | Sub-type filter, GCB category, AVM |
| 99.co | Portal | Sub-type filter, calculators |
| SRX | Data + portal | X-Value AVM, Singapore Property Index |
| EdgeProp | Data + portal | En-bloc calculator (condos only) |
| SquareFoot Research | Data | Transaction history, district analysis |
| The Landed Collective | Agent site | Listings only |
| URA | Government | Master Plan map, transaction search |
| SLA OneMap | Government | Land Betterment Charge calculator |

### What does not exist (confirmed gaps)

1. **GCB zone overlay** on any commercial portal
2. **Unified PSF normaliser** (land PSF vs built-up PSF side by side)
3. **Rebuild feasibility estimator** (allowable GFA + cost range from a single address)
4. **Road reserve impact disclosure** on any listing
5. **Flood risk property checker** at address level
6. **Tree Conservation Area overlay** on any portal
7. **Foreign buyer / PR eligibility pre-checker** before shortlisting
8. **Integrated due diligence dashboard** aggregating all planning data

### Why the gap exists

- Landed is ~5% of households — not a priority for large portals building for condo buyers
- Data lives across URA, SLA, LTA, NParks, PUB — 5+ separate portals, different formats
- Agents gatekeep this complexity to justify fees — incumbent resistance
- High technical barrier: GeoJSON polygon lookups, government API registration, domain expertise to interpret URA DC handbooks

### Market size indicators

- ~56,700 private housing units in pipeline (end-2025)
- GCB market alone: ~2,800 plots, transacting at SGD 10M–100M+
- Landed prices rose 7.6% in FY2025 (vs 2.3% non-landed)
- Buyers making SGD 3M–50M decisions with inadequate information tooling

---

## 3. Architecture Decisions

### Why FastAPI (not Next.js API routes)

The rules engine (development parameters, ownership eligibility) has meaningful computational logic best expressed in Python with clear branching. It also positions the backend to call SLA/URA APIs from a server-side context with proper credentials management. The frontend never exposes API keys.

### Why JSON seed files (not SQLite or Postgres)

For a 10-property MVP, a database adds schema migration complexity with no query performance benefit. The `SeedLoader` builds in-memory dictionaries at startup. When real APIs are integrated, `seed_loader.py` service methods are replaced one by one without touching the router layer.

### Why no chart library (no recharts/chart.js)

The PSF bar comparison is built with plain `<div>` percentage-width bars. No heavy bundle dependency for a minor visualisation. Recharts or Chart.js can be added when the product needs more sophisticated analytics.

### Why `dynamic()` no-SSR for MapPanel

Leaflet.js requires `window` and `document` which do not exist in Node.js server rendering. This is the standard Next.js pattern. The `dynamic()` wrapper is applied at the `IntelligenceCard` level, not inside `MapPanel` itself.

### Why hardcoded ABSD rates (not an API)

ABSD rates are legislated and change infrequently (last changed Feb/Apr 2023). Hardcoding them with a clear "as of" date is more reliable than scraping. When rates change, update `backend/app/services/ownership_rules.py` directly.

### Two-tier search fallback

```
Has OneMap credentials in .env?
  YES → Call OneMap API (real Singapore addresses)
  NO  → Fall back to 10 seed properties
```

This means the app works immediately without any credentials, and upgrades transparently when credentials are added.

---

## 4. Project Structure

```
property/
├── CLAUDE.md
├── .gitignore
├── docker-compose.yml
│
├── backend/
│   ├── main.py                          # FastAPI app, CORS, startup
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example                     # Copy to .env and fill in credentials
│   ├── .venv/                           # Python 3.11 virtual environment
│   └── app/
│       ├── config.py                    # Settings via pydantic-settings (.env)
│       ├── models/
│       │   ├── __init__.py              # PropertyIntelligenceCardResponse (composed)
│       │   ├── property.py              # PropertyRecord, SearchResult
│       │   ├── transaction.py           # TransactionRecord
│       │   ├── zone.py                  # URAZoneRecord, DevelopmentParamsRecord
│       │   ├── risk_flags.py            # RiskFlagsRecord
│       │   └── ownership.py             # OwnershipRules, ABSDRate
│       ├── routers/
│       │   ├── property.py              # 3 endpoints + postal→district helper
│       │   └── health.py                # GET /health
│       ├── services/
│       │   ├── seed_loader.py           # In-memory store — swap here for live APIs
│       │   ├── development_rules.py     # Rules engine: type → dev params
│       │   ├── ownership_rules.py       # ABSD table + SC/PR/foreigner eligibility
│       │   └── property_service.py      # Assembles the full Intelligence Card
│       └── integrations/
│           ├── onemap.py                # OneMap geocoding (LIVE — needs creds)
│           ├── ura_master_plan.py       # URA Master Plan zone lookup (stub)
│           ├── ura_transactions.py      # URA transactions via data.gov.sg (LIVE)
│           └── pub_flood_map.py         # PUB flood risk (stub)
│
├── frontend/
│   ├── Dockerfile
│   ├── .env.local                       # NEXT_PUBLIC_API_URL
│   └── src/
│       ├── app/
│       │   ├── layout.tsx               # Root layout, metadata
│       │   ├── page.tsx                 # Landing page + search
│       │   ├── not-found.tsx            # 404 page
│       │   └── property/[id]/
│       │       └── page.tsx             # Intelligence Card page (server component)
│       ├── components/
│       │   ├── search/
│       │   │   ├── SearchBar.tsx        # Debounced input + dropdown
│       │   │   └── SearchSuggestions.tsx
│       │   ├── card/
│       │   │   ├── IntelligenceCard.tsx # Composes all 6 panels
│       │   │   ├── CardHeader.tsx       # Address, type/tenure/district badges
│       │   │   ├── MapPanel.tsx         # react-leaflet, dynamic no-SSR
│       │   │   ├── ZonePanel.tsx        # URA zone + GCB Area banner
│       │   │   ├── DevelopmentParamsPanel.tsx
│       │   │   ├── TransactionPanel.tsx # PSF bars + table
│       │   │   ├── OwnershipPanel.tsx   # Eligibility grid + ABSD table
│       │   │   └── RiskFlagsPanel.tsx   # 4 risk flag rows
│       │   └── ui/
│       │       ├── Badge.tsx
│       │       ├── StatCard.tsx
│       │       ├── RiskFlagItem.tsx
│       │       ├── SectionHeading.tsx
│       │       └── LoadingSkeleton.tsx
│       ├── hooks/
│       │   └── usePropertySearch.ts     # Debounced search with AbortController
│       ├── lib/
│       │   ├── api.ts                   # Typed fetch client
│       │   ├── formatters.ts            # SGD, PSF, area, date formatters
│       │   └── utils.ts                 # cn() (clsx + tailwind-merge)
│       └── types/
│           └── index.ts                 # All shared TypeScript interfaces
│
└── data/
    ├── properties.json                  # 10 seed properties
    ├── transactions.json                # ~40 seed transactions
    ├── ura_zones.json                   # URA zone + GCBA per property
    ├── risk_flags.json                  # Flood, tree, conservation, road reserve
    └── development_rules.json           # Dev params by property type
```

---

## 5. Running Locally

### Prerequisites

- Python 3.11
- Node.js 20+ (installed via `brew install node`)

### Backend

```bash
cd backend

# First time only — create virtualenv and install deps
python3.11 -m venv .venv
.venv/bin/pip install -r requirements.txt

# Start dev server
.venv/bin/uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# First time only
npm install

# Start dev server
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Interactive API docs:** http://localhost:8000/docs

### Docker (both services together)

```bash
docker compose up --build
```

---

## 6. Backend Reference

**Stack:** FastAPI 0.111, Pydantic v2, Python 3.11, httpx

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/property/search?q={query}` | Address autocomplete — uses OneMap if credentials set, else seed |
| GET | `/api/property/{id}` | Full Intelligence Card response |
| GET | `/api/property/{id}/transactions` | Transaction history for a property |
| GET | `/health` | Health check |

### Development Rules Engine (URA DC Guidelines)

Computed in `backend/app/services/development_rules.py`. No API needed — these are statutory rules from URA's Development Control handbooks.

| Type | Max Storeys | Site Coverage | Plot Ratio | Side Setback |
|------|-------------|---------------|------------|--------------|
| Terrace | 2 | 50% | 1.4 | 2.0m |
| Semi-Detached | 2 | 50% | 1.4 | 2.0m |
| Bungalow | 2 | 50% | 1.4 | 3.0m |
| GCB | 2 | **40%** | **1.1** | 3.0m |
| Cluster | 3 | 45% | strata | 1.5m |
| Conservation | 2 | 50% | guidelines | 2.0m |

GCB override: when `uraZone.isGcba = true`, site coverage is forced to 40% and plot ratio to 1.1 regardless of property type field.

### Ownership Rules Engine (ABSD as of Feb/Apr 2023)

Computed in `backend/app/services/ownership_rules.py`. Update this file when ABSD rates change.

| Profile | ABSD Rate |
|---------|-----------|
| SC — 1st property | 0% |
| SC — 2nd property | 20% |
| SC — 3rd+ property | 30% |
| PR — 1st property | 5% |
| PR — 2nd+ property | 30% |
| Foreigner (any) | 60% |
| Entity / Company | 65% |

Special rules:
- **GCB**: SC only. PR and foreigners ineligible regardless of LDAU approval.
- **Non-strata landed** (terrace, semi-d, bungalow, conservation): foreigners need SLA LDAU written approval. PRs with <5 years residency may also need approval.
- **Cluster / strata landed**: foreigners eligible (land is common property).

---

## 7. Frontend Reference

**Stack:** Next.js 16, TypeScript, Tailwind CSS, react-leaflet, OpenStreetMap

### Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | Client | Landing page — dark hero, SearchBar, example chips |
| `/property/[id]` | Server | Intelligence Card — fetches from backend, passes to IntelligenceCard |
| `/_not-found` | Static | 404 page |

### Intelligence Card Panels

| Panel | Key data shown |
|-------|---------------|
| CardHeader | Address, property type badge, tenure badge, district, land + built-up area |
| MapPanel | Leaflet map at zoom 16, OSM tiles, marker with popup |
| ZonePanel | URA zone chip; amber GCBA banner + restrictions box if in GCB Area |
| DevelopmentParamsPanel | 6 StatCards (storeys, height, coverage, GFA, front/side setbacks) + amber notes |
| TransactionPanel | PSF bar chart (land=blue, built-up=teal) + sortable transaction table |
| OwnershipPanel | SC/PR/Foreigner 3-col eligibility grid + ABSD rate table |
| RiskFlagsPanel | Flood risk, tree conservation, conservation status, road reserve — green/amber/red |

### Color System

| Purpose | Tailwind classes |
|---------|----------------|
| GCB Area banner | `bg-amber-500 text-white` |
| Risk — low/none | `bg-green-50 border-green-200 text-green-800` |
| Risk — medium | `bg-amber-50 border-amber-200 text-amber-900` |
| Risk — high | `bg-red-50 border-red-200 text-red-800` |
| Notes/warnings | `bg-amber-50 border-amber-200 text-amber-700` |
| Special conditions | `bg-blue-50 border-blue-200 text-blue-700` |
| ABSD 0% | `bg-green-100 text-green-800` |
| ABSD 60%+ | `bg-red-100 text-red-800` |

### Key Frontend Files

| File | Purpose |
|------|---------|
| `src/types/index.ts` | **Frontend/backend contract** — all shared TypeScript interfaces. Change here propagates everywhere. |
| `src/lib/api.ts` | Typed fetch client: `searchProperties()`, `getPropertyCard()`, `getTransactions()` |
| `src/lib/formatters.ts` | `formatPrice()` (SGD 4.20M), `formatPSF()` ($2,333 psf), `formatArea()`, `formatDate()` |
| `src/hooks/usePropertySearch.ts` | Debounced 300ms search with AbortController cancellation |

---

## 8. Seed Data

10 properties covering all landed types:

| ID | Address | Type | District | Notes |
|----|---------|------|----------|-------|
| prop_01 | 45 Tembeling Road | Terrace | D15 | — |
| prop_02 | 12 Sennett Road | Terrace | D19 | Road reserve flag, medium flood risk |
| prop_03 | 8 Leedon Road | Semi-D | D10 | — |
| prop_04 | 22 Chancery Lane | Semi-D | D11 | — |
| prop_05 | 15 Greenleaf Place | Bungalow | D21 | Tree conservation (Tembusu) |
| prop_06 | 33 Maybankbong Road | Bungalow | D21 | — |
| prop_07 | 27 Nassim Road | GCB | D10 | Nassim GCBA, heritage rain tree |
| prop_08 | 6 Bin Tong Park | GCB | D21 | Bin Tong Park GCBA |
| prop_09 | 3 Ballota Park | Cluster | D16 | 999-yr, foreigner-eligible, medium flood |
| prop_10 | 41 Emerald Hill Road | Conservation | D9 | URA Cat 1, high land PSF ~$4,500 |

**To add a property:** append one record to each of:
- `data/properties.json`
- `data/transactions.json` (3–5 records with matching `property_id`)
- `data/ura_zones.json`
- `data/risk_flags.json`

Then restart the backend. No code changes needed.

---

## 9. API Credentials — Step by Step

### OneMap (Address Search & Geocoding)

**What it unlocks:** Real Singapore address autocomplete — any address, not just the 10 seed properties.

**How to get credentials:**

1. Go to **https://www.onemap.gov.sg/apidocs/**
2. Click **"Get API Key"** or **"Register"**
3. Fill in: name, email, organisation (can be "Individual"), purpose ("Property research tool")
4. You receive login credentials by email (usually within minutes)
5. The credentials are an **email + password** used to generate a Bearer token — not a static API key

**Add to `.env`:**
```
ONEMAP_EMAIL=your@email.com
ONEMAP_PASSWORD=yourpassword
```

**How it works in the code:**
- `backend/app/integrations/onemap.py` calls `POST /api/auth/post/getToken` to get a Bearer token
- Token is cached in memory for 2.5 days (valid for 3 days), refreshed automatically
- Search calls `GET /api/common/elastic/search?searchVal={query}&returnGeom=Y&getAddrDetails=Y`
- The router (`backend/app/routers/property.py`) uses OneMap if credentials are set, falls back to seed search if not

**Cost:** Free.

---

### URA API (Transaction History + Master Plan Zone Data)

**What it unlocks:**
- Real transaction history for any Singapore property (last 60 months)
- URA Master Plan zone lookup by coordinates (replaces seed zone data)

**How to get the access key:**

1. Go to **https://eservice.ura.gov.sg/maps/api/reg.html**
2. Fill in the registration form:
   - **Name:** your full name
   - **Email:** where the key will be sent
   - **Organisation:** your company or "Individual"
   - **Purpose of use:** e.g. "Property research and due diligence platform"
3. Click **Submit**
4. You receive an `accessKey` by email — typically **within 1 business day** (often a few hours)

**Add to `.env`:**
```
URA_ACCESS_KEY=your-ura-access-key
```

**How the token works:**
The access key is used to generate a daily token:
```
GET https://www.ura.gov.sg/uraDataService/insertNewToken.action
  ?service=token
  &accessKey={your_access_key}
```
Returns a token valid for ~1 day. Pass this token in all subsequent API calls.

**Transaction API:**
```
GET https://www.ura.gov.sg/uraDataService/invokeUraDS
  ?service=PMI_Resi_Transaction
  &refPeriod=24q4        ← quarter (e.g. Q4 2024)
  &token={daily_token}
```

**Master Plan zone API:**
```
GET https://www.ura.gov.sg/uraDataService/invokeUraDS
  ?service=PMI_Comm_MasterPlan
  &year=2019
  &token={daily_token}
```
Returns GeoJSON polygons for all Master Plan zones. Load at startup, use point-in-polygon lookup (with `shapely`) to find the zone for any coordinate.

**Cost:** Free with registration.

---

### data.gov.sg Transactions (No Auth Required — Already Live)

Transaction data is also available via data.gov.sg with no registration:

```
GET https://data.gov.sg/api/action/datastore_search
  ?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc
  &q={postal_code}
  &limit=50
```

This is already wired in `backend/app/integrations/ura_transactions.py` and returns real data immediately. Test it now:

```bash
curl "https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&q=258482&limit=5"
```

---

### Summary — Which Credentials to Get First

| Priority | Service | Registration | Time to receive | Cost |
|----------|---------|--------------|-----------------|------|
| 1st | **OneMap** | https://www.onemap.gov.sg/apidocs/ | Minutes | Free |
| 2nd | **URA API** | https://eservice.ura.gov.sg/maps/api/reg.html | ~1 business day | Free |
| Not needed | data.gov.sg | None required | Instant | Free |

---

## 10. Live API Integration Status

| Feature | Status | Notes |
|---------|--------|-------|
| Address search | **Live** (with OneMap creds) | Falls back to seed if no creds |
| Transaction history (data.gov.sg) | **Live** (no creds needed) | Wire into card endpoint |
| Transaction history (URA API) | Stub | Richer data; needs URA access key |
| URA zone + GCB Area | Seed only | Needs URA key + GeoJSON polygon lookup |
| Development parameters | **Live** (rules engine) | Computed from URA DC handbook rules |
| Ownership eligibility + ABSD | **Live** (rules engine) | Hardcoded, accurate as of Apr 2023 |
| Flood risk | Seed only | PUB WMS or data.gov.sg polygon dataset |
| Tree conservation | Seed only | NParks data — not yet publicly available as API |
| Road reserve | Seed only | SLA INLIS subscription required |
| Conservation status | Seed only | URA conservation list (parseable PDF/web) |

### How to wire in new data sources

All data access passes through `backend/app/services/seed_loader.py`. Each method is a single swap point:

```python
# Before (seed):
zone = SeedLoader.get_ura_zone(property_id)

# After (live):
zone = await URAMasterPlan.get_zone(prop.coordinates.lat, prop.coordinates.lng)
```

The integration stubs in `backend/app/integrations/` document the exact endpoint, auth, and response shape for each data source.

---

## 11. Deployment

See **[DEPLOY.md](./DEPLOY.md)** for the full step-by-step guide.

**Summary:**
- **Frontend** → Vercel (free): connect GitHub repo, set root dir to `frontend`, add `NEXT_PUBLIC_API_URL`
- **Backend** → Render (free tier / $7/month): connect GitHub repo, `render.yaml` is auto-detected

Every `git push` to `main` triggers automatic redeployment on both platforms.

## 12. Environment Variables

### Backend (`backend/.env`)

```bash
# Copy from .env.example
cp backend/.env.example backend/.env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATA_DIR` | No | Path to seed data. Defaults to `../../data`. On Render: `/opt/render/project/src/data` |
| `CORS_ORIGINS` | No | Comma-separated allowed origins. Default: `http://localhost:3000` |
| `ONEMAP_EMAIL` | For live search | OneMap account email |
| `ONEMAP_PASSWORD` | For live search | OneMap account password |
| `URA_ACCESS_KEY` | For URA data | URA API access key |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend URL. Default: `http://localhost:8000`. On Vercel: `https://landediq-api.onrender.com` |

---

## 13. Roadmap

### Phase 2 — Live data completion

- [ ] Wire URA zone + GCBA lookup via Master Plan GeoJSON + `shapely` point-in-polygon
- [ ] Wire URA transaction API (richer data than data.gov.sg — buyer type, exact dates)
- [ ] Wire live transactions into the card endpoint for postal-code-based lookups
- [ ] Land Betterment Charge (LBC) estimator using SLA OneMap API

### Phase 3 — Additional intelligence

- [ ] Rebuild feasibility estimator (allowable GFA → estimated build cost range using BCA indices)
- [ ] Architect / QS directory integrated with card (referral model)
- [ ] Foreign buyer / PR eligibility wizard (guided LDAU assessment)
- [ ] En-bloc calculator for cluster / strata landed developments

### Phase 4 — Product

- [ ] User accounts + saved properties
- [ ] Price alert for watched properties
- [ ] PDF export of Intelligence Card (for sharing with banker / lawyer)
- [ ] Agent white-label (B2B SaaS — agents send branded cards to clients)
- [ ] Freemium: basic zone info free, full card SGD 99–299/report
