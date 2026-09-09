import type { CollectionItem } from '../../types';

export type DataMode = 'local' | 'api';

export interface CollectionStore {
  readonly mode: DataMode;
  getAllItems(): Promise<CollectionItem[]>;
  getItem(id: string): Promise<CollectionItem | undefined>;
  putItem(item: CollectionItem): Promise<void>;
  deleteItem(id: string): Promise<void>;
  clearAllItems(): Promise<void>;
  putAllItems(items: CollectionItem[]): Promise<void>;
  getMeta<T>(key: string): Promise<T | undefined>;
  setMeta<T>(key: string, value: T): Promise<void>;
  /** API mode: server handles first-boot seed. Local mode: client seeds. */
  shouldSeedLocally(): boolean;
}
