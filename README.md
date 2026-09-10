# Tejas Playground

**Lego and Hotwheels Collection** — a dark, cinematic inventory for your shelf. Demo on GitHub Pages; real shared data on your home Docker stack.

**Live demo:** https://t-teja.github.io/shelf-stories/

## Screenshots

### Showcase
![Showcase](docs/screenshots/showcase.svg)

### The Collection
![The Collection](docs/screenshots/collection.svg)

### Paddock (F1)
![Paddock](docs/screenshots/paddock.svg)

## Modes

| Mode | Where | Data store |
|------|--------|------------|
| **Local (default)** | `npm run dev`, GitHub Pages | Browser **IndexedDB** (per device/profile) |
| **API / Docker** | Home Docker Compose | Shared **SQLite** + uploads — phone, TV, and PC share one inventory |

## Local demo (IndexedDB)

```bash
npm install
npm run dev
```

Production SPA build:

```bash
npm run build
npm run preview
```

## Home Docker (shared inventory)

```bash
docker compose up -d --build
```

Open **http://localhost:3080** (or `http://<your-lan-ip>:3080` from phone/TV).

```bash
curl http://localhost:3080/api/health
```

Data: `./data/shelf-stories.sqlite`, uploads in `./data/uploads/`.

### Add to an existing compose stack

```yaml
  shelf-stories:
    build: ./shelf-stories
    container_name: shelf-stories
    ports:
      - "3080:3080"
    volumes:
      - ./shelf-stories/data:/data
    environment:
      PORT: "3080"
      DATA_DIR: /data
      DB_PATH: /data/shelf-stories.sqlite
      UPLOADS_DIR: /data/uploads
    restart: unless-stopped
```

## Features

- **Showcase** slideshow of the full owned collection (Ken Burns, keyboard controls)
- **Add / edit** by name, SKU, barcode, model — Camera + Gallery uploads
- **Purchase fields**: price, quantity, purchased from, purchase date, product link
- **Rooms**: Showcase, Collection, Garage, Brick Yard, Vault, Hangar, Paddock, Wishlist, Gallery Wall
- **Collapsible sidebar** (desktop)
- Search, filters, sort, duplicate warnings, JSON export/import
- Seeded with Ferrari Daytona SP3 (`42143`) and F1 Speed Champions `77242`–`77251`

## GitHub Pages

Static SPA only (IndexedDB) — not your home inventory. Workflow: `.github/workflows/pages.yml`.

## Tech

Vite + React 19 + TypeScript + Tailwind v4 · `idb` · Express + better-sqlite3 (Docker)

## Env knobs

| Variable | Meaning |
|----------|---------|
| `VITE_DATA_MODE` | `local` \| `api` \| `auto` |
| `VITE_API_URL` | API prefix, e.g. `/api` |
| `VITE_BASE` | Vite base (`/shelf-stories/` for project Pages) |
