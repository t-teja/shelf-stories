# Shelf Stories

A playful **Hot Wheels / Lego / Matchbox / Mattel** collection inventory — clay-card museum vibes by day, dark cinema TV showcase by night.

Runs in two modes:

| Mode | Where | Data store |
|------|--------|------------|
| **Local (default)** | `npm run dev`, GitHub Pages | Browser **IndexedDB** (per device/profile) |
| **API / Docker** | Home Docker Compose | Shared **SQLite** + uploads volume — phone, TV, and PC share one inventory |

## Local demo (IndexedDB)

```bash
npm install
npm run dev
```

Production SPA build (local mode):

```bash
npm run build
npm run preview
```

## Home Docker (shared inventory)

One container serves the SPA + REST API on **port 3080**. SQLite and uploads live under `./data`.

```bash
docker compose up -d --build
```

Open **http://localhost:3080** (or `http://<your-lan-ip>:3080` from phone/TV).

Useful checks:

```bash
docker compose config          # validate compose file
curl http://localhost:3080/api/health
```

Data paths inside the volume:

- SQLite: `./data/shelf-stories.sqlite`
- Uploads: `./data/uploads/`

Stop / wipe:

```bash
docker compose down
# optional: rm -rf ./data   # deletes the shared inventory
```

### Adding to an existing home compose stack

Paste this service into your stack’s `docker-compose.yml` (adjust build context / volume path as needed):

```yaml
  shelf-stories:
    build: ./shelf-stories          # or image: shelf-stories:latest
    container_name: shelf-stories
    ports:
      - "3080:3080"
    volumes:
      - ./shelf-stories/data:/data  # or a named volume
    environment:
      PORT: "3080"
      DATA_DIR: /data
      DB_PATH: /data/shelf-stories.sqlite
      UPLOADS_DIR: /data/uploads
    restart: unless-stopped
```

Then `docker compose up -d --build shelf-stories`.

### Local API without Docker

```bash
npm install
npm run server:install
npm run build:docker          # frontend with VITE_DATA_MODE=api
DATA_DIR=./data STATIC_DIR=./dist PORT=3080 npm run server
```

Or run Vite against a live API (`vite.config.ts` proxies `/api` → `:3080`):

```bash
# terminal 1
npm run server:install && DATA_DIR=./data PORT=3080 npm run server
# terminal 2 — auto mode will probe /api/health via the Vite proxy
VITE_DATA_MODE=auto VITE_API_URL=/api npm run dev
```

## GitHub Pages demo

The Pages deploy is a **static SPA** using **IndexedDB only** — it is **not** your home inventory and does not call a backend.

Workflow: `.github/workflows/pages.yml`

- Builds with `VITE_DATA_MODE=local` and `VITE_BASE=/shelf-stories/`
- Deploys the `dist/` folder to GitHub Pages

Enable Pages → “GitHub Actions” as the source in the repo settings. Demo URL shape: `https://<user>.github.io/shelf-stories/`.

## How data is stored

- **IndexedDB (local / Pages)** — items live in the browser profile. Export JSON from the app header to back up or move data.
- **SQLite (Docker)** — `./data/shelf-stories.sqlite` on the host, shared by every device hitting the LAN URL. Image uploads can be data URLs in the DB (MVP) or files under `./data/uploads` via `POST /api/upload`.

On first boot (empty DB / empty IndexedDB), the app seeds demo Hot Wheels flavor plus your starter owned collection:

- LEGO Icons **Beluga Cargo Flight** (21346)
- LEGO Technic **Ferrari Daytona SP3** (“Daytona Technic”, 42143)
- Several **2024 F1** Speed Champions sets (Red Bull, Mercedes, Ferrari, McLaren, Aston Martin, Alpine)

## REST API (Docker mode)

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/health` | Liveness |
| GET/POST | `/api/items` | List / create |
| GET/PUT/DELETE | `/api/items/:id` | Read / update / delete |
| GET | `/api/items/duplicates?q=` | Duplicate helper |
| GET | `/api/export` | JSON export |
| POST | `/api/import` | `{ items, mode: "replace"\|"merge" }` |
| POST | `/api/upload` | multipart `file` → `/uploads/...` |

CORS is enabled for LAN use.

## Features

- **Add items** by name, SKU, barcode, or model number with heuristic auto brand / category / color / tags
- **Images**: paste URLs, upload files, multi-image with primary cover, colorful brand placeholders when none provided
- **Rooms**: All Library, Garage, Brick Yard, Treasure Room, Sky Hangar, Paddock, Want List, Stud Map, TV Showcase
- **Library**: grid + list, search, multi-filter, sort
- **Stud Map** + **TV Showcase** slideshow
- **Duplicate warnings**, want list, export / import JSON

## Tech

- Vite + React 19 + TypeScript + Tailwind CSS v4
- `idb` for IndexedDB; Express + **better-sqlite3** for Docker
- Dual data layer: `src/lib/storage` (`local` \| `api`) selected by `VITE_DATA_MODE` / `VITE_API_URL`

## Project layout

```
src/
  components/          UI
  hooks/               useCollection, useTheme
  lib/
    storage/           local (IndexedDB) + api (REST) stores
    seed.ts            starter + demo seeds
    heuristics.ts
  App.tsx
server/                Express + SQLite API
Dockerfile             single image: static SPA + API on :3080
docker-compose.yml
data/                  persistent volume (gitignored contents)
.github/workflows/pages.yml
```

## Env knobs (frontend build)

| Variable | Meaning |
|----------|---------|
| `VITE_DATA_MODE` | `local` \| `api` \| `auto` (default auto) |
| `VITE_API_URL` | API prefix, e.g. `/api` (Docker) |
| `VITE_BASE` | Vite `base` path (`/shelf-stories/` for project Pages) |
