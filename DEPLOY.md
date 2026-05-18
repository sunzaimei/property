# Deployment Guide — Vercel (Frontend) + Render (Backend)

## Overview

| Service | Platform | URL after deploy |
|---------|----------|-----------------|
| Frontend (Next.js) | Vercel | `https://property-livid-one.vercel.app` |
| Backend (FastAPI) | Render | `https://landediq-api.onrender.com` |

Cost: **Free** to start. Render free tier spins down after 15 min inactivity (first request takes ~30s to wake). Upgrade to $7/month for always-on.

---

## Step 1 — Push to GitHub

You need a GitHub account. If you don't have one, sign up at https://github.com

```bash
# In the project root
cd /Users/I775775/property

# Create a repo on GitHub first (github.com → New repository → name: "landediq")
# Then:
git init   # already done
git add .
git commit -m "Initial commit — LandedIQ MVP"
git remote add origin https://github.com/YOUR_USERNAME/landediq.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2 — Deploy Backend on Render

1. Go to **https://render.com** → Sign up (free, use GitHub login)
2. Click **New → Web Service**
3. Connect your GitHub account → select the `landediq` repo
4. Render will detect `render.yaml` automatically — click **Apply**

If it doesn't auto-detect, fill in manually:
- **Root Directory:** `backend`
- **Runtime:** Python 3
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Set environment variables on Render

In the Render dashboard → your service → **Environment**:

| Key | Value |
|-----|-------|
| `DATA_DIR` | `/opt/render/project/src/data` |
| `CORS_ORIGINS` | `https://landediq.vercel.app` (update after you know your Vercel URL) |
| `ONEMAP_EMAIL` | *(your OneMap email — optional)* |
| `ONEMAP_PASSWORD` | *(your OneMap password — optional)* |
| `URA_ACCESS_KEY` | *(your URA key when received — optional)* |

5. Click **Deploy** — takes ~3 minutes
6. Note your backend URL: `https://landediq-api.onrender.com`
7. Test: `curl https://landediq-api.onrender.com/health` → `{"status":"ok"}`

---

## Step 3 — Deploy Frontend on Vercel

1. Go to **https://vercel.com** → Sign up (free, use GitHub login)
2. Click **Add New → Project**
3. Import your `landediq` GitHub repo
4. Vercel auto-detects Next.js — set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js (auto-detected)

### Set environment variable on Vercel

In project settings → **Environment Variables**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://landediq-api.onrender.com` |

5. Click **Deploy** — takes ~2 minutes
6. Your app is live at `https://landediq.vercel.app`

---

## Step 4 — Update CORS on Render

Once you know your exact Vercel URL (e.g. `https://landediq-xyz.vercel.app`):

1. Render dashboard → landediq-api → Environment
2. Update `CORS_ORIGINS` to your exact Vercel URL
3. Render redeploys automatically

---

## Updating the app after this

Every time you push to GitHub `main` branch:
- Vercel redeploys the frontend automatically (~1 min)
- Render redeploys the backend automatically (~2 min)

```bash
git add .
git commit -m "your change description"
git push
```

---

## Custom Domain (optional)

### On Vercel
1. Project settings → Domains → Add your domain
2. Follow Vercel's DNS instructions (add CNAME record at your registrar)

### On Render
1. Service settings → Custom Domains → Add domain
2. Update `CORS_ORIGINS` on Render to include your custom domain

### Recommended registrar
**Cloudflare** — https://www.cloudflare.com/products/registrar/
- `.com` domains at cost (~$10/year, no markup)
- Free CDN and DDoS protection included
- Easy DNS management

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Backend 503 on first request | Render free tier cold start — wait 30s and retry |
| CORS error in browser | Check `CORS_ORIGINS` on Render matches your exact Vercel URL |
| `DATA_DIR` not found | Confirm `DATA_DIR=/opt/render/project/src/data` is set in Render env vars |
| Vercel build fails | Check `NEXT_PUBLIC_API_URL` is set in Vercel environment variables |
| Search returns no results | OneMap credentials not set — falls back to 10 seed properties (expected) |
