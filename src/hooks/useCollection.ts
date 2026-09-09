import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CollectionItem, Filters, Room, SortKey } from '../types';
import { getStore, type DataMode } from '../lib/storage';
import { createSeedItems } from '../lib/seed';
import { isSimilar } from '../lib/heuristics';

const defaultFilters: Filters = {
  brand: 'All',
  category: 'All',
  color: 'All',
  tag: 'All',
  premiumOnly: false,
  starredOnly: false,
  search: '',
};

function roomFilter(room: Room, item: CollectionItem): boolean {
  switch (room) {
    case 'all':
    case 'studmap':
    case 'tv':
      return !item.isWant;
    case 'garage':
      return !item.isWant && (item.brand === 'Hot Wheels' || item.brand === 'Matchbox' || item.category === 'Cars');
    case 'brickyard':
      return !item.isWant && (item.brand === 'Lego' || item.category === 'Technic' || item.category === 'Sets');
    case 'treasure':
      return !item.isWant && (item.category === 'Premium' || item.starred || item.featured);
    case 'sky':
      return !item.isWant && item.category === 'Flights';
    case 'paddock':
      return !item.isWant && item.category === 'F1';
    case 'want':
      return item.isWant;
    default:
      return true;
  }
}

export function useCollection() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataMode, setDataMode] = useState<DataMode | null>(null);
  const [room, setRoom] = useState<Room>('all');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortKey>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    (async () => {
      try {
        const store = await getStore();
        setDataMode(store.mode);
        let all = await store.getAllItems();
        if (store.shouldSeedLocally()) {
          const seeded = await store.getMeta<boolean>('seeded');
          if (all.length === 0 && !seeded) {
            const seed = createSeedItems();
            await store.putAllItems(seed);
            await store.setMeta('seeded', true);
            all = seed;
          }
        }
        setItems(all);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const upsert = useCallback(async (item: CollectionItem) => {
    const store = await getStore();
    await store.putItem(item);
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx === -1) return [item, ...prev];
      const next = [...prev];
      next[idx] = item;
      return next;
    });
  }, []);

  const remove = useCallback(async (id: string) => {
    const store = await getStore();
    await store.deleteItem(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const replaceAll = useCallback(async (next: CollectionItem[]) => {
    const store = await getStore();
    await store.clearAllItems();
    await store.putAllItems(next);
    if (store.shouldSeedLocally()) {
      await store.setMeta('seeded', true);
    }
    setItems(next);
  }, []);

  const findDuplicates = useCallback(
    (draft: Pick<CollectionItem, 'name' | 'sku' | 'barcode' | 'modelNumber'>, excludeId?: string) => {
      return items.filter((item) => {
        if (excludeId && item.id === excludeId) return false;
        if (draft.sku && item.sku && draft.sku.toLowerCase() === item.sku.toLowerCase()) return true;
        if (draft.barcode && item.barcode && draft.barcode === item.barcode) return true;
        if (draft.modelNumber && item.modelNumber && draft.modelNumber.toLowerCase() === item.modelNumber.toLowerCase()) return true;
        if (draft.name && isSimilar(draft.name, item.name)) return true;
        return false;
      });
    },
    [items]
  );

  const allTags = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => {
      i.tags.forEach((t) => s.add(t));
      i.customLabels.forEach((t) => s.add(t));
    });
    return Array.from(s).sort();
  }, [items]);

  const visible = useMemo(() => {
    let list = items.filter((i) => roomFilter(room, i));
    const q = filters.search.trim().toLowerCase();
    if (q) {
      list = list.filter((i) =>
        [i.name, i.sku, i.barcode, i.modelNumber, i.brand, i.category, i.notes, ...i.tags, ...i.customLabels]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
    }
    if (filters.brand !== 'All') list = list.filter((i) => i.brand === filters.brand);
    if (filters.category !== 'All') list = list.filter((i) => i.category === filters.category);
    if (filters.color !== 'All') list = list.filter((i) => i.color === filters.color);
    if (filters.tag !== 'All') {
      list = list.filter((i) => i.tags.includes(filters.tag) || i.customLabels.includes(filters.tag));
    }
    if (filters.premiumOnly) list = list.filter((i) => i.category === 'Premium' || i.tags.includes('Premium'));
    if (filters.starredOnly) list = list.filter((i) => i.starred);

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'brand':
          return a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name);
        case 'color':
          return a.color.localeCompare(b.color) || a.name.localeCompare(b.name);
        case 'date':
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
    return list;
  }, [items, room, filters, sort]);

  const showcaseItems = useMemo(() => {
    const featured = items.filter((i) => !i.isWant && (i.featured || i.starred));
    if (featured.length > 0) return featured;
    return items.filter((i) => !i.isWant);
  }, [items]);

  return {
    items,
    visible,
    showcaseItems,
    loading,
    dataMode,
    room,
    setRoom,
    filters,
    setFilters,
    sort,
    setSort,
    viewMode,
    setViewMode,
    upsert,
    remove,
    replaceAll,
    findDuplicates,
    allTags,
    defaultFilters,
  };
}
