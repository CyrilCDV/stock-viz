# Architecture — stock-viz

## Overview

`stock-viz` is a self-hosted stock market visualization webapp. It is built as a monorepo and deployed via Docker Compose on a single VPS.

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Web (frontend + BFF) | Next.js (React) | SSR, Server Components, UI-specific API aggregation |
| Backend | Node.js — Fastify or Express (TBD) | Business logic, DB access, generic REST API |
| Database | PostgreSQL | Reliable time-series queries, OHLCV aggregations |
| Reverse proxy | Caddy or nginx (TBD) | Caddy: automatic HTTPS; nginx: more control and wider adoption |
| Containerization | Docker Compose | Single-server deployment, simple orchestration |
| ORM / queries | Prisma or Drizzle (TBD) | Type-safe queries, schema migrations |
| Charting | Lightweight Charts (TradingView OSS) | Purpose-built for financial data |
| Data ingestion | Custom Node.js service | Fetches stock data from external API on a schedule |

---

## Repository Structure

Single monorepo — one git repository for the entire project.

```
stock-viz/
├── web/                        # Next.js app (frontend + BFF)
│   ├── src/
│   │   ├── app/                # App router (pages, layouts)
│   │   ├── components/         # React components (charts, UI)
│   │   └── lib/                # Backend API client, utilities
│   └── package.json
├── backend/                    # Node.js API server (Fastify or Express)
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   ├── services/           # Business logic
│   │   └── db/                 # DB client, repositories
│   └── package.json
├── ingestion/                  # Stock data fetcher
│   └── package.json
├── db/
│   └── migrations/             # SQL migration files
├── docker-compose.yml          # Development
├── docker-compose.prod.yml     # Production overrides
├── .env.example
└── ARCHITECTURE.md
```

---

## Services

```
┌─────────────┐     HTTPS      ┌──────────────────┐
│   Internet  │ ─────────────► │  Caddy / nginx   │  Reverse proxy + TLS
└─────────────┘                └────────┬─────────┘
                                        │ HTTP
                                 ┌──────▼──────┐
                                 │   Next.js   │  BFF (UI + aggregation)
                                 └──────┬──────┘
                                        │ HTTP
                                 ┌──────▼──────┐
                                 │   Backend   │  Business logic + REST API
                                 └──────┬──────┘
                                        │ query
                                 ┌──────▼──────┐
                                 │  PostgreSQL │
                                 └──────▲──────┘
                                        │ INSERT (scheduled)
                                 ┌──────┴──────┐
                                 │  Ingestion  │  Scheduled data fetcher
                                 └─────────────┘
```

### Reverse proxy (Caddy or nginx)
Two options, both viable as a Docker container:

- **Caddy** — automatic TLS certificate management via Let's Encrypt, minimal configuration
- **nginx** — more widely adopted, more documentation and examples available, requires a separate Certbot container for TLS

Decision can be deferred until deployment setup begins.

### Next.js (web)
- Serves the React frontend (SSR, Server Components)
- Aggregates and shapes data from the backend specifically for the UI
- Does not connect to PostgreSQL directly

### Backend
- Standalone Node.js service (Fastify or Express)
- Owns business logic and all database access
- Exposes a generic REST API consumed by the BFF (and potentially other clients in the future)

### PostgreSQL (db)
- Stores historical OHLCV stock data
- Data persisted via a named Docker volume

### Ingestion
- Standalone Node.js process
- Fetches stock data from an external provider (e.g. Alpha Vantage, Polygon.io)
- Runs on a schedule (cron inside container, or Docker-level scheduling)
- Writes directly to PostgreSQL

---

## Data Flow

```
External API
     │
     │  scheduled fetch
     ▼
 Ingestion service
     │
     │  INSERT
     ▼
 PostgreSQL
     │
     │  query
     ▼
 Backend (REST API)
     │
     │  HTTP / JSON
     ▼
 Next.js BFF
     │
     │  render / props
     ▼
 React frontend
     │
     │  render
     ▼
 Lightweight Charts
```

---

## Deployment

- Target: single VPS (e.g. Hetzner, DigitalOcean, Linode)
- Orchestration: Docker Compose
- TLS: managed by Caddy (automatic) or nginx + Certbot
- Secrets: environment variables via `.env` file (not committed to git)

### Limitations
- No horizontal scaling or automatic failover
- Suitable for personal or portfolio use; upgrade to Kubernetes or a managed platform if traffic or availability requirements grow

---

## Future Considerations

- **TimescaleDB** extension on PostgreSQL if dataset grows significantly
- **WebSockets / SSE** for real-time price updates
- **Vercel + Neon/Supabase** as a serverless alternative if self-hosting becomes a burden
