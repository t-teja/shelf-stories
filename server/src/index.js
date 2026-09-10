import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import {
  getAllItems,
  getItem,
  insertItem,
  updateItem,
  deleteItem,
  replaceAllItems,
  putAllItems,
  findDuplicates,
  seedIfEmpty,
  getUploadsDir,
  DB_PATH,
} from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3080);
const STATIC_DIR = process.env.STATIC_DIR || path.resolve(__dirname, '../../dist');
const uploadsDir = getUploadsDir();

seedIfEmpty();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '25mb' }));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').slice(0, 12) || '.bin';
    cb(null, `${Date.now()}-${randomUUID()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'shelf-stories', db: DB_PATH });
});

app.get('/api/items', (_req, res) => {
  res.json(getAllItems());
});

app.get('/api/items/duplicates', (req, res) => {
  const q = req.query.q ?? '';
  res.json(findDuplicates(q));
});

app.get('/api/items/:id', (req, res) => {
  const item = getItem(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.post('/api/items', (req, res) => {
  const body = req.body || {};
  if (!body.name || !body.brand || !body.category || !body.color) {
    return res.status(400).json({ error: 'name, brand, category, color required' });
  }
  const now = new Date().toISOString();
  const item = {
    id: body.id || randomUUID(),
    name: body.name,
    sku: body.sku,
    barcode: body.barcode,
    modelNumber: body.modelNumber,
    brand: body.brand,
    category: body.category,
    color: body.color,
    tags: body.tags ?? [],
    customLabels: body.customLabels ?? [],
    images: body.images ?? [],
    primaryImageIndex: body.primaryImageIndex ?? 0,
    notes: body.notes,
    starred: !!body.starred,
    featured: !!body.featured,
    isWant: !!body.isWant,
    acquiredAt: body.acquiredAt,
    createdAt: body.createdAt || now,
    updatedAt: body.updatedAt || now,
  };
  if (getItem(item.id)) {
    return res.status(409).json({ error: 'Item already exists', id: item.id });
  }
  insertItem(item);
  res.status(201).json(item);
});

app.put('/api/items/:id', (req, res) => {
  const existing = getItem(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  const updated = updateItem(req.params.id, {
    ...existing,
    ...body,
    id: req.params.id,
    updatedAt: body.updatedAt || new Date().toISOString(),
  });
  res.json(updated);
});

app.delete('/api/items/:id', (req, res) => {
  const ok = deleteItem(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

app.get('/api/export', (_req, res) => {
  const items = getAllItems();
  const payload = {
    app: 'Tejas Playground',
    version: 1,
    exportedAt: new Date().toISOString(),
    items,
  };
  res.setHeader('Content-Disposition', `attachment; filename="tejas-playground-${new Date().toISOString().slice(0, 10)}.json"`);
  res.json(payload);
});

app.post('/api/import', (req, res) => {
  const body = req.body || {};
  const items = Array.isArray(body) ? body : body.items;
  const mode = body.mode === 'merge' ? 'merge' : 'replace';
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Expected { items: [], mode?: "replace"|"merge" }' });
  }
  const normalized = items.map((item) => ({
    ...item,
    id: item.id || randomUUID(),
    tags: item.tags ?? [],
    customLabels: item.customLabels ?? [],
    images: item.images ?? [],
    primaryImageIndex: item.primaryImageIndex ?? 0,
    starred: !!item.starred,
    featured: !!item.featured,
    isWant: !!item.isWant,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }));

  if (mode === 'merge') {
    putAllItems(normalized);
  } else {
    replaceAllItems(normalized);
  }
  res.json({ ok: true, count: getAllItems().length, mode });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required' });
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url, filename: req.file.filename, size: req.file.size });
});

app.use('/uploads', express.static(uploadsDir));

if (fs.existsSync(STATIC_DIR)) {
  app.use(express.static(STATIC_DIR));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
  });
} else {
  console.warn(`[shelf-stories] Static dir missing (${STATIC_DIR}) — API-only mode`);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[shelf-stories] listening on http://0.0.0.0:${PORT}`);
  console.log(`[shelf-stories] db=${DB_PATH}`);
  console.log(`[shelf-stories] uploads=${uploadsDir}`);
});
