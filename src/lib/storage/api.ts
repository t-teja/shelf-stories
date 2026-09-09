import type { CollectionItem } from '../../types';
import type { CollectionStore } from './types';

function apiBase(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (raw === undefined || raw === null || raw === '') return '/api';
  return raw.replace(/\/$/, '');
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `API ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function createApiStore(): CollectionStore {
  return {
    mode: 'api',

    shouldSeedLocally() {
      return false;
    },

    async getAllItems() {
      return request<CollectionItem[]>('/items');
    },

    async getItem(id) {
      try {
        return await request<CollectionItem>(`/items/${encodeURIComponent(id)}`);
      } catch {
        return undefined;
      }
    },

    async putItem(item) {
      // Upsert: try PUT, fall back to POST if missing
      const res = await fetch(`${apiBase()}/items/${encodeURIComponent(item.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.status === 404) {
        await request('/items', { method: 'POST', body: JSON.stringify(item) });
        return;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `API ${res.status}`);
      }
    },

    async deleteItem(id) {
      await request(`/items/${encodeURIComponent(id)}`, { method: 'DELETE' });
    },

    async clearAllItems() {
      // Replace with empty via import replace semantics
      await request('/import', {
        method: 'POST',
        body: JSON.stringify({ items: [], mode: 'replace' }),
      });
    },

    async putAllItems(items) {
      await request('/import', {
        method: 'POST',
        body: JSON.stringify({ items, mode: 'replace' }),
      });
    },

    async getMeta<T>(_key: string) {
      // Server owns seed meta; no client meta needed in API mode
      return undefined as T | undefined;
    },

    async setMeta<T>(_key: string, _value: T) {
      // no-op in API mode
    },
  };
}

export async function probeApiHealth(timeoutMs = 2500): Promise<boolean> {
  const base = apiBase();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${base}/health`, { signal: ctrl.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}
