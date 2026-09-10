import type { CollectionItem } from '../types';
import { brandInitial } from './heuristics';

/** Bump when seed catalog changes so IndexedDB / server DB re-seed. */
export const SEED_VERSION = 'tejas-playground-v2';

const CDN = (id: string) => `https://cdn.rebrickable.com/media/sets/${id}-1.jpg`;

/** Fallback SVG when a user adds an item with no image (not used for seeds). */
export function svgPlaceholder(brand: CollectionItem['brand'], color: CollectionItem['color'], label: string): string {
  const brandHex: Record<string, string> = {
    'Hot Wheels': '#DA291C',
    Lego: '#1A1A1A',
    Matchbox: '#222222',
    Mattel: '#2A2A2A',
    Other: '#181818',
  };
  const colorHex: Record<string, string> = {
    Red: '#3A1010', Blue: '#1A2430', Yellow: '#2A2418', Green: '#142018',
    Orange: '#2A1C12', Purple: '#1E1824', Black: '#0A0A0A', White: '#2A2A2A',
    Silver: '#242424', Gold: '#2A2418', Pink: '#24181C', Multi: '#1A1A1A', Other: '#141414',
  };
  const c1 = brandHex[brand] ?? '#111111';
  const c2 = colorHex[color] ?? '#1A1A1A';
  const initial = brandInitial(brand);
  const safe = label.replace(/[<>&']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#g)"/>
  <rect x="24" y="24" width="592" height="432" fill="none" stroke="rgba(218,41,28,0.35)" stroke-width="1"/>
  <text x="320" y="220" text-anchor="middle" font-family="Georgia,serif" font-size="56" font-weight="500" fill="#F5F5F5">${initial}</text>
  <text x="320" y="280" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="500" letter-spacing="3" fill="#8F8F8F">${safe.slice(0, 28)}</text>
  <text x="320" y="320" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" letter-spacing="4" fill="#6B6B6B">${brand.toUpperCase()}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

type SeedPartial = Omit<CollectionItem, 'id' | 'createdAt' | 'updatedAt' | 'images' | 'primaryImageIndex'> & {
  imageUrl: string;
  id?: string;
};

export function createSeedItems(): CollectionItem[] {
  const now = Date.now();
  const mk = (i: number, partial: SeedPartial): CollectionItem => {
    const { imageUrl, id, ...rest } = partial;
    return {
      ...rest,
      id: id ?? `seed-${i}`,
      images: [imageUrl],
      primaryImageIndex: 0,
      createdAt: new Date(now - i * 86400000).toISOString(),
      updatedAt: new Date(now - i * 86400000).toISOString(),
    };
  };

  return [
    mk(1, {
      id: 'seed-daytona-technic-42143',
      name: 'LEGO Technic Ferrari Daytona SP3',
      sku: '42143',
      modelNumber: '42143',
      brand: 'Lego',
      category: 'Technic',
      color: 'Red',
      tags: ['Lego', 'Technic', 'Daytona', 'Ferrari', 'Supercar', 'Premium'],
      customLabels: ['Owned', 'Display'],
      notes: 'Ferrari Daytona SP3 (42143) — flagship Technic supercar.',
      starred: true,
      featured: true,
      isWant: false,
      acquiredAt: '2024-05-20',
      imageUrl: CDN('42143'),
    }),
    mk(2, {
      id: 'seed-f1-2024-ferrari-77242',
      name: 'Ferrari SF-24 F1 Race Car',
      sku: '77242',
      modelNumber: '77242',
      brand: 'Lego',
      category: 'F1',
      color: 'Red',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Ferrari'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 — Scuderia Ferrari SF-24.',
      starred: true,
      featured: true,
      isWant: false,
      acquiredAt: '2024-03-08',
      imageUrl: CDN('77242'),
    }),
    mk(3, {
      id: 'seed-f1-2024-redbull-77243',
      name: 'Oracle Red Bull Racing RB20 F1',
      sku: '77243',
      modelNumber: '77243',
      brand: 'Lego',
      category: 'F1',
      color: 'Blue',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Red Bull'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 — Oracle Red Bull Racing RB20.',
      starred: true,
      featured: true,
      isWant: false,
      acquiredAt: '2024-03-01',
      imageUrl: CDN('77243'),
    }),
    mk(4, {
      id: 'seed-f1-2024-mercedes-77244',
      name: 'Mercedes-AMG PETRONAS W15',
      sku: '77244',
      modelNumber: '77244',
      brand: 'Lego',
      category: 'F1',
      color: 'Silver',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Mercedes'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 — Mercedes-AMG PETRONAS W15.',
      starred: true,
      featured: false,
      isWant: false,
      acquiredAt: '2024-03-01',
      imageUrl: CDN('77244'),
    }),
    mk(5, {
      id: 'seed-f1-2024-aston-77245',
      name: 'Aston Martin Aramco AMR24',
      sku: '77245',
      modelNumber: '77245',
      brand: 'Lego',
      category: 'F1',
      color: 'Green',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Aston Martin'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 — Aston Martin Aramco AMR24.',
      starred: false,
      featured: false,
      isWant: false,
      acquiredAt: '2024-04-02',
      imageUrl: CDN('77245'),
    }),
    mk(6, {
      id: 'seed-f1-2024-vcarb-77246',
      name: 'Visa Cash App VCARB 01',
      sku: '77246',
      modelNumber: '77246',
      brand: 'Lego',
      category: 'F1',
      color: 'Blue',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'VCARB', 'RB'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 — Visa Cash App RB VCARB 01.',
      starred: false,
      featured: false,
      isWant: false,
      acquiredAt: '2024-04-05',
      imageUrl: CDN('77246'),
    }),
    mk(7, {
      id: 'seed-f1-2024-sauber-77247',
      name: 'KICK Sauber C44',
      sku: '77247',
      modelNumber: '77247',
      brand: 'Lego',
      category: 'F1',
      color: 'Green',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Sauber', 'Stake'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 — KICK Sauber C44.',
      starred: false,
      featured: false,
      isWant: false,
      acquiredAt: '2024-04-08',
      imageUrl: CDN('77247'),
    }),
    mk(8, {
      id: 'seed-f1-2024-alpine-77248',
      name: 'BWT Alpine A524',
      sku: '77248',
      modelNumber: '77248',
      brand: 'Lego',
      category: 'F1',
      color: 'Blue',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Alpine'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 — BWT Alpine A524.',
      starred: false,
      featured: false,
      isWant: false,
      acquiredAt: '2024-04-10',
      imageUrl: CDN('77248'),
    }),
    mk(9, {
      id: 'seed-f1-2024-williams-77249',
      name: 'Williams Racing FW46',
      sku: '77249',
      modelNumber: '77249',
      brand: 'Lego',
      category: 'F1',
      color: 'Blue',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Williams'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 — Williams Racing FW46.',
      starred: false,
      featured: false,
      isWant: false,
      acquiredAt: '2024-04-12',
      imageUrl: CDN('77249'),
    }),
    mk(10, {
      id: 'seed-f1-2024-haas-77250',
      name: 'MoneyGram Haas VF-24',
      sku: '77250',
      modelNumber: '77250',
      brand: 'Lego',
      category: 'F1',
      color: 'White',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Haas'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 — MoneyGram Haas VF-24.',
      starred: false,
      featured: false,
      isWant: false,
      acquiredAt: '2024-04-15',
      imageUrl: CDN('77250'),
    }),
    mk(11, {
      id: 'seed-f1-2024-mclaren-77251',
      name: 'McLaren MCL38',
      sku: '77251',
      modelNumber: '77251',
      brand: 'Lego',
      category: 'F1',
      color: 'Orange',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'McLaren'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 — McLaren Formula 1 Team MCL38.',
      starred: true,
      featured: true,
      isWant: false,
      acquiredAt: '2024-03-15',
      imageUrl: CDN('77251'),
    }),
  ];
}
