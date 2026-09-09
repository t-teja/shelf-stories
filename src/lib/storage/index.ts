import { localStore } from './local';
import { createApiStore, probeApiHealth } from './api';
import type { CollectionStore, DataMode } from './types';

export type { CollectionStore, DataMode } from './types';
export { localStore } from './local';
export { createApiStore, probeApiHealth } from './api';

let resolved: CollectionStore | null = null;
let resolvePromise: Promise<CollectionStore> | null = null;

/**
 * Mode selection:
 * - VITE_DATA_MODE=local → IndexedDB (GitHub Pages / local demo)
 * - VITE_DATA_MODE=api → REST API (Docker home deploy)
 * - VITE_DATA_MODE=auto or unset:
 *     if VITE_API_URL is set (including empty string meaning /api) → probe /api/health
 *     else → local IndexedDB
 *
 * For Docker image builds: VITE_DATA_MODE=api VITE_API_URL=/api
 * For Pages builds: VITE_DATA_MODE=local
 */
export async function getStore(): Promise<CollectionStore> {
  if (resolved) return resolved;
  if (!resolvePromise) {
    resolvePromise = (async () => {
      const mode = (import.meta.env.VITE_DATA_MODE ?? 'auto') as string;
      const apiUrlEnv = import.meta.env.VITE_API_URL;

      if (mode === 'local') {
        resolved = localStore;
        return resolved;
      }

      if (mode === 'api') {
        resolved = createApiStore();
        return resolved;
      }

      // auto: prefer API when VITE_API_URL is defined (even '') or health succeeds at /api
      const shouldTryApi = apiUrlEnv !== undefined || mode === 'auto';
      if (shouldTryApi) {
        const ok = await probeApiHealth();
        if (ok) {
          resolved = createApiStore();
          return resolved;
        }
      }

      resolved = localStore;
      return resolved;
    })();
  }
  return resolvePromise;
}

export function getResolvedMode(): DataMode | null {
  return resolved?.mode ?? null;
}
