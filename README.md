# Shelf Stories

A playful **Hot Wheels / Lego / Matchbox / Mattel** collection inventory — clay-card museum vibes by day, dark cinema TV showcase by night.

Client-only SPA. Data lives in **IndexedDB** in your browser.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Features

- **Add items** by name, SKU, barcode, or model number with heuristic auto brand / category / color / tags
- **Images**: paste URLs, upload files (stored as data URLs), multi-image with primary cover, colorful brand placeholders when none provided
- **Rooms**: All Library, Garage, Brick Yard, Treasure Room, Sky Hangar, Paddock, Want List, Stud Map, TV Showcase
- **Library**: grid + list, search, multi-filter (brand, category, color, tags, premium, starred), sort by name / date / color / brand
- **Stud Map**: visual wall of covers
- **TV Showcase**: fullscreen-ready slideshow, Ken Burns animation, captions, Space pause, arrows, F fullscreen, Esc exit, featured/starred playlist
- **Star / featured** items
- **Duplicate warnings** on similar name / SKU / barcode / model
- **Want list** room
- **Export / import** JSON backups
- Seeded with ~8 demo Hot Wheels + Lego pieces on first open

## Design notes

- Accents: stud red `#E31C23`, brick yellow `#FFD500`, sky blue `#00A3E0`
- Soft rounded clay cards, stud-dot backdrop, Space Grotesk + Nunito
- Light default theme + dark “cinema” theme (toggle in header) for TV viewing
- Responsive for phone, tablet, desktop, and TV-ish layouts

## Tech

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `idb` for IndexedDB
- `lucide-react` icons

## Project layout

```
src/
  components/   UI (cards, modal, TV, stud map, sidebar…)
  hooks/        useCollection, useTheme
  lib/          db, heuristics, seed, export/import
  types.ts
  App.tsx
```

## Limitations

- No backend / sync / multi-device accounts — data is local to the browser profile
- No live barcode camera scanning (manual barcode field only)
- Image uploads are stored as data URLs in IndexedDB (large photos can grow storage use)
- Heuristic brand/category detection is keyword-based, not an external product API
- Import merge uses item `id` for dedupe; re-importing newly created items with new IDs may create duplicates
