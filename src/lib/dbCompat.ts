import type { CollectionItem } from '../types';
import { getStore } from './storage';

export async function getAllItems(): Promise<CollectionItem[]> {
  return (await getStore()).getAllItems();
}

export async function putItem(item: CollectionItem): Promise<void> {
  await (await getStore()).putItem(item);
}

export async function deleteItem(id: string): Promise<void> {
  await (await getStore()).deleteItem(id);
}

export async function clearAllItems(): Promise<void> {
  await (await getStore()).clearAllItems();
}

export async function putAllItems(items: CollectionItem[]): Promise<void> {
  await (await getStore()).putAllItems(items);
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  return (await getStore()).getMeta<T>(key);
}

export async function setMeta<T>(key: string, value: T): Promise<void> {
  await (await getStore()).setMeta(key, value);
}
