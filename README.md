# LandedIQ — Singapore Landed Property Due Diligence

**Live:** https://property-livid-one.vercel.app  
**API docs:** https://landediq-api.onrender.com/docs

Enter any Singapore landed property address and get an instant Intelligence Card — replacing days of fragmented research with a 2-minute lookup.

---

## What it does

| Panel | Data |
|-------|------|
| URA Zone + GCB Area | Zone code, Good Class Bungalow Area status and restrictions |
| Development Parameters | Max storeys, height, site coverage, GFA, setbacks (URA DC Handbook rules engine) |
| Transaction PSF History | Land PSF vs built-up PSF bar chart + transaction table |
| Ownership Eligibility | SC / PR / Foreigner eligibility grid + ABSD rate table |
| Risk Flags | Flood risk, tree conservation, conservation status, road reserve |

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS, react-leaflet |
| Backend | FastAPI, Python 3.11, Pydantic v2, httpx |
| Maps | OpenStreetMap via react-leaflet (no API key needed) |
| Data | JSON seed files (10 properties) + live data.gov.sg transactions API |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Running locally

**Backend**
```bash
cd backend
python3.11 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Backend API docs: http://localhost:8000/docs

---

## Architecture

```
property/
├── backend/          # FastAPI — rules engines, seed loader, API integrations
│   └── app/
│       ├── services/ # Development params + ownership eligibility rules engines
│       ├── routers/  # 3 REST endpoints
│       └── integrations/ # OneMap, URA, data.gov.sg (live), PUB (stub)
├── frontend/         # Next.js — search, Intelligence Card panels
│   └── src/
│       ├── app/      # Landing page + property/[id] card page
│       ├── components/card/  # 7 Intelligence Card panels
│       └── hooks/    # Debounced search with AbortController
└── data/             # JSON seed data (10 properties, ~40 transactions)
```

No database — seed data loads into memory at startup. Live API integrations swap in one method at a time without touching the router layer.

---

## Live API status

| Feature | Status |
|---------|--------|
| Address search | Live (OneMap) / falls back to seed |
| Transaction history | Live (data.gov.sg, no key needed) |
| Development parameters | Live (rules engine, no API needed) |
| Ownership eligibility + ABSD | Live (rules engine, no API needed) |
| URA zone + GCB Area | Seed data |
| Flood / tree / road reserve risk | Seed data |
