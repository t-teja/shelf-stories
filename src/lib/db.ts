import { openDB, type IDBPDatabase } from 'idb';
import type { CollectionItem } from '../types';

const DB_NAME = 'shelf-stories';
const DB_VERSION = 1;
const STORE = 'items';
const META = 'meta';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' });
          store.createIndex('brand', 'brand');
          store.createIndex('category', 'category');
          store.createIndex('starred', 'starred');
          store.createIndex('isWant', 'isWant');
        }
        if (!db.objectStoreNames.contains(META)) {
          db.createObjectStore(META, { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllItems(): Promise<CollectionItem[]> {
  const db = await getDb();
  return db.getAll(STORE);
}

export async function putItem(item: CollectionItem): Promise<void> {
  const db = await getDb();
  await db.put(STORE, item);
}

export async function deleteItem(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE, id);
}

export async function clearAllItems(): Promise<void> {
  const db = await getDb();
  await db.clear(STORE);
}

export async function putAllItems(items: CollectionItem[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(STORE, 'readwrite');
  await Promise.all([...items.map((i) => tx.store.put(i)), tx.done]);
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const db = await getDb();
  const row = await db.get(META, key);
  return row?.value as T | undefined;
}

export async function setMeta<T>(key: string, value: T): Promise<void> {
  const db = await getDb();
  await db.put(META, { key, value });
}
