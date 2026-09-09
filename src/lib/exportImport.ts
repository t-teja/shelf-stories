import type { CollectionItem } from '../types';

export function exportToJson(items: CollectionItem[]): void {
  const payload = {
    app: 'Shelf Stories',
    version: 1,
    exportedAt: new Date().toISOString(),
    items,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shelf-stories-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function parseImportFile(file: File): Promise<CollectionItem[]> {
  const text = await file.text();
  const data = JSON.parse(text);
  const items: CollectionItem[] = Array.isArray(data) ? data : data.items;
  if (!Array.isArray(items)) throw new Error('Invalid Shelf Stories export');
  return items.map((item) => ({
    ...item,
    tags: item.tags ?? [],
    customLabels: item.customLabels ?? [],
    images: item.images ?? [],
    primaryImageIndex: item.primaryImageIndex ?? 0,
    starred: !!item.starred,
    featured: !!item.featured,
    isWant: !!item.isWant,
  }));
}
