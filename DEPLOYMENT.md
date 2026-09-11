# ApniYatra Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide provides step-by-step instructions for deploying ApniYatra to production using **Render** (FastAPI backend + Managed PostgreSQL) and **Vercel** (Next.js 16 frontend), as well as running the full stack locally with **Docker Compose**.

---

## Architecture Overview

```
                        ┌─────────────────────────────────┐
                        │      Vercel (Edge Network)      │
                        │    Next.js 16 + Tailwind CSS    │
                        │   https://apniyatra.vercel.app  │
                        └────────────────┬────────────────┘
                                         │
                        HTTPS API Calls  │ (NEXT_PUBLIC_API_URL)
                                         ▼
                        ┌─────────────────────────────────┐
                        │          Render (Web)           │
                        │       FastAPI + Uvicorn         │
                        │  https://apniyatra.onrender.com │
                        └───────┬─────────────────┬───────┘
                                │                 │
               SQLAlchemy / ORM │                 │ Google GenAI SDK
                                ▼                 ▼
        ┌─────────────────────────────┐   ┌───────────────────────────┐
        │      Render PostgreSQL      │   │     Google Gemini API     │
        │       PostgreSQL 16         │   │ (Structured JSON Mode)    │
        └─────────────────────────────┘   └───────────────────────────┘
```

---

## Part 1: Backend Deployment on Render

Render hosts both the **FastAPI Web Service** and the **Managed PostgreSQL Database**.

### Option A: Using Render Blueprint (`render.yaml`) — Recommended

1. Push this repository to GitHub or GitLab.
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** and select **Blueprint**.
4. Connect your ApniYatra repository.
5. Render will automatically detect [`render.yaml`](./render.yaml) and configure:
   - Managed PostgreSQL database (`apniyatra-db`).
   - Web Service (`apniyatra-backend`) with Python environment, automatic connection string binding, and health checks.
6. In the environment configuration step, add your **`GEMINI_API_KEY`** (optional, fallback data is used if omitted).
7. Click **Apply**. Render will provision PostgreSQL, install dependencies, and launch FastAPI on HTTPS.

### Option B: Manual Setup on Render

#### 1. Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com/) -> **New +** -> **PostgreSQL**.
2. **Name**: `apniyatra-db`
3. **Database**: `apniyatra_db`
4. **User**: `apniyatra_user`
5. **Region**: Choose the region closest to your users (e.g., Oregon or Singapore).
6. **Plan**: Free (or Starter).
7. Click **Create Database**. Copy the **Internal Database URL** (for services inside Render) and **External Database URL**.

#### 2. Create FastAPI Web Service
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your Git repository.
3. Configure the following settings:
   - **Name**: `apniyatra-backend`
   - **Language**: `Python`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path**: `/health`
4. In **Environment Variables**, add:
   | Key | Value | Description |
   |-----|-------|-------------|
   | `ENVIRONMENT` | `production` | Production mode |
   | `DATABASE_URL` | `postgresql://...` | Internal Database URL from Step 1 |
   | `SECRET_KEY` | *(generate random 32+ char string)* | JWT secret token key |
   | `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API key |
   | `CORS_ORIGINS` | `["https://<your-vercel-app>.vercel.app","http://localhost:3000"]` | Allowed origins |
5. Click **Create Web Service**. Once deployed, copy your backend URL (e.g., `https://apniyatra-backend.onrender.com`).

#### 3. Seed Initial Heritage Data on Render
Once the backend is live, seed the database with initial places, oral folklore, services, and passports:
```bash
curl -X POST https://apniyatra-backend.onrender.com/api/v1/seed/
```

---

## Part 2: Frontend Deployment on Vercel

Vercel provides native Next.js hosting with edge caching, automatic HTTPS, and CI/CD.

### Step-by-Step Vercel Setup

1. Push your code to GitHub.
2. Navigate to [Vercel Dashboard](https://vercel.com/) and click **Add New...** -> **Project**.
3. Import your ApniYatra repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and select `frontend`.
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)
5. Expand **Environment Variables** and add:
   | Name | Value | Description |
   |------|-------|-------------|
   | `NEXT_PUBLIC_API_URL` | `https://apniyatra-backend.onrender.com` | Live Render backend URL |
6. Click **Deploy**. Vercel will build and deploy your application.
7. Once deployed, note your Vercel domain (e.g., `https://apniyatra.vercel.app`).
8. **Update CORS in Render**: Go back to your Render Backend settings and ensure `CORS_ORIGINS` includes your live Vercel domain:
   ```json
   ["https://apniyatra.vercel.app", "http://localhost:3000"]
   ```

---

## Part 3: Local Container Deployment with Docker Compose

To test the entire containerized production stack on your local machine:

### Prerequisites
- Docker & Docker Compose installed.

### Running the Stack
```bash
# 1. From the repository root, build and start all 3 containers:
docker compose up --build -d

# 2. Inspect container status:
docker compose ps

# 3. View service logs:
docker compose logs -f backend
docker compose logs -f frontend

# 4. Seed the containerized database:
curl -X POST http://localhost:8000/api/v1/seed/
```

### Local Container Endpoints
- **Frontend (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **Backend (FastAPI)**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
- **PostgreSQL Database**: `localhost:5432` (`user: postgres`, `password: postgres`)

### Stopping Containers
```bash
docker compose down
# To also delete volumes:
docker compose down -v
```

---

## Part 4: Verification Checklist

| Verification Step | Command / URL | Expected Result | Status |
|-------------------|---------------|-----------------|--------|
| Frontend Build | `cd frontend && npm run build` | Exits with code 0, all routes static | **VERIFIED** |
| Backend Pytest | `python -m pytest backend/tests -v` | 5/5 tests pass with 100% success | **VERIFIED** |
| Health Check | `GET /health` | HTTP 200 `{"status": "healthy"}` | **VERIFIED** |
| Places Listing | `GET /api/v1/places/` | HTTP 200, returns array of heritage places | **VERIFIED** |
| Folklore Feed | `GET /api/v1/places/folklore/feed` | HTTP 200, returns verified oral legends | **VERIFIED** |
| Recommendation Engine | `POST /api/v1/places/recommend` | HTTP 200, Scikit-Learn TF-IDF matches | **VERIFIED** |
| Itinerary Generator | `POST /api/v1/itineraries/generate` | HTTP 200, Structured JSON day plans | **VERIFIED** |
| Compose Config | `docker compose config` | Valid configuration syntax | **VERIFIED** |
