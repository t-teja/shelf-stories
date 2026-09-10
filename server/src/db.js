import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { createSeedItems, SEED_VERSION } from './seed.js';

const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), '../data');
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'shelf-stories.sqlite');
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(DATA_DIR, 'uploads');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT,
    barcode TEXT,
    modelNumber TEXT,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT '[]',
    customLabels TEXT NOT NULL DEFAULT '[]',
    images TEXT NOT NULL DEFAULT '[]',
    primaryImageIndex INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    starred INTEGER NOT NULL DEFAULT 0,
    featured INTEGER NOT NULL DEFAULT 0,
    isWant INTEGER NOT NULL DEFAULT 0,
    acquiredAt TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_items_brand ON items(brand);
  CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
  CREATE INDEX IF NOT EXISTS idx_items_sku ON items(sku);
`);

function rowToItem(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    sku: row.sku ?? undefined,
    barcode: row.barcode ?? undefined,
    modelNumber: row.modelNumber ?? undefined,
    brand: row.brand,
    category: row.category,
    color: row.color,
    tags: JSON.parse(row.tags || '[]'),
    customLabels: JSON.parse(row.customLabels || '[]'),
    images: JSON.parse(row.images || '[]'),
    primaryImageIndex: row.primaryImageIndex ?? 0,
    notes: row.notes ?? undefined,
    starred: !!row.starred,
    featured: !!row.featured,
    isWant: !!row.isWant,
    acquiredAt: row.acquiredAt ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function itemToParams(item) {
  return {
    id: item.id,
    name: item.name,
    sku: item.sku ?? null,
    barcode: item.barcode ?? null,
    modelNumber: item.modelNumber ?? null,
    brand: item.brand,
    category: item.category,
    color: item.color,
    tags: JSON.stringify(item.tags ?? []),
    customLabels: JSON.stringify(item.customLabels ?? []),
    images: JSON.stringify(item.images ?? []),
    primaryImageIndex: item.primaryImageIndex ?? 0,
    notes: item.notes ?? null,
    starred: item.starred ? 1 : 0,
    featured: item.featured ? 1 : 0,
    isWant: item.isWant ? 1 : 0,
    acquiredAt: item.acquiredAt ?? null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

const upsertStmt = db.prepare(`
  INSERT INTO items (
    id, name, sku, barcode, modelNumber, brand, category, color,
    tags, customLabels, images, primaryImageIndex, notes,
    starred, featured, isWant, acquiredAt, createdAt, updatedAt
  ) VALUES (
    @id, @name, @sku, @barcode, @modelNumber, @brand, @category, @color,
    @tags, @customLabels, @images, @primaryImageIndex, @notes,
    @starred, @featured, @isWant, @acquiredAt, @createdAt, @updatedAt
  )
  ON CONFLICT(id) DO UPDATE SET
    name=excluded.name,
    sku=excluded.sku,
    barcode=excluded.barcode,
    modelNumber=excluded.modelNumber,
    brand=excluded.brand,
    category=excluded.category,
    color=excluded.color,
    tags=excluded.tags,
    customLabels=excluded.customLabels,
    images=excluded.images,
    primaryImageIndex=excluded.primaryImageIndex,
    notes=excluded.notes,
    starred=excluded.starred,
    featured=excluded.featured,
    isWant=excluded.isWant,
    acquiredAt=excluded.acquiredAt,
    createdAt=excluded.createdAt,
    updatedAt=excluded.updatedAt
`);

export function getUploadsDir() {
  return UPLOADS_DIR;
}

export function getAllItems() {
  return db.prepare('SELECT * FROM items ORDER BY createdAt DESC').all().map(rowToItem);
}

export function getItem(id) {
  return rowToItem(db.prepare('SELECT * FROM items WHERE id = ?').get(id));
}

export function insertItem(item) {
  upsertStmt.run(itemToParams(item));
  return getItem(item.id);
}

export function updateItem(id, item) {
  const existing = getItem(id);
  if (!existing) return null;
  const merged = { ...existing, ...item, id, updatedAt: item.updatedAt || new Date().toISOString() };
  upsertStmt.run(itemToParams(merged));
  return getItem(id);
}

export function deleteItem(id) {
  const info = db.prepare('DELETE FROM items WHERE id = ?').run(id);
  return info.changes > 0;
}

export function clearAllItems() {
  db.prepare('DELETE FROM items').run();
}

export function putAllItems(items) {
  const tx = db.transaction((list) => {
    for (const item of list) upsertStmt.run(itemToParams(item));
  });
  tx(items);
}

export function replaceAllItems(items) {
  const tx = db.transaction((list) => {
    db.prepare('DELETE FROM items').run();
    for (const item of list) upsertStmt.run(itemToParams(item));
  });
  tx(items);
}

export function getMeta(key) {
  const row = db.prepare('SELECT value FROM meta WHERE key = ?').get(key);
  if (!row) return undefined;
  try {
    return JSON.parse(row.value);
  } catch {
    return row.value;
  }
}

export function setMeta(key, value) {
  db.prepare(
    `INSERT INTO meta (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run(key, JSON.stringify(value));
}

function norm(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isSimilar(a, b) {
  const na = norm(a);
  const nb = norm(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;
  const ta = new Set(String(a).toLowerCase().split(/\s+/).filter((t) => t.length > 2));
  const tb = String(b).toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  if (ta.size === 0 || tb.length === 0) return false;
  const overlap = tb.filter((t) => ta.has(t)).length;
  return overlap / Math.max(ta.size, tb.length) >= 0.7;
}

export function findDuplicates(q) {
  const query = String(q || '').trim();
  if (!query) return [];
  const all = getAllItems();
  return all.filter((item) => {
    if (item.sku && item.sku.toLowerCase() === query.toLowerCase()) return true;
    if (item.barcode && item.barcode === query) return true;
    if (item.modelNumber && item.modelNumber.toLowerCase() === query.toLowerCase()) return true;
    if (isSimilar(query, item.name)) return true;
    return false;
  });
}

export function seedIfEmpty() {
  const version = getMeta('seedVersion');
  if (version !== SEED_VERSION) {
    const seed = createSeedItems();
    replaceAllItems(seed);
    setMeta('seeded', true);
    setMeta('seedVersion', SEED_VERSION);
    console.log(`[tejas-playground] Re-seeded ${seed.length} items (v=${SEED_VERSION}) into ${DB_PATH}`);
    return seed.length;
  }
  return 0;
}

export { DB_PATH, DATA_DIR };
