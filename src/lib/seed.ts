import type { CollectionItem } from '../types';
import { brandInitial } from './heuristics';

function svgPlaceholder(brand: CollectionItem['brand'], color: CollectionItem['color'], label: string): string {
  const brandHex: Record<string, string> = {
    'Hot Wheels': '#E31C23',
    Lego: '#FFD500',
    Matchbox: '#F97316',
    Mattel: '#00A3E0',
    Other: '#8B5CF6',
  };
  const colorHex: Record<string, string> = {
    Red: '#E31C23', Blue: '#00A3E0', Yellow: '#FFD500', Green: '#22C55E',
    Orange: '#F97316', Purple: '#8B5CF6', Black: '#374151', White: '#E2E8F0',
    Silver: '#94A3B8', Gold: '#EAB308', Pink: '#EC4899', Multi: '#A855F7', Other: '#64748B',
  };
  const c1 = brandHex[brand] ?? '#E31C23';
  const c2 = colorHex[color] ?? '#00A3E0';
  const initial = brandInitial(brand);
  const safe = label.replace(/[<>&]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" rx="28" fill="url(#g)"/>
  <circle cx="90" cy="90" r="28" fill="rgba(255,255,255,0.25)"/>
  <circle cx="90" cy="90" r="14" fill="rgba(255,255,255,0.45)"/>
  <circle cx="550" cy="390" r="36" fill="rgba(0,0,0,0.15)"/>
  <text x="320" y="220" text-anchor="middle" font-family="system-ui,sans-serif" font-size="72" font-weight="800" fill="rgba(255,255,255,0.95)">${initial}</text>
  <text x="320" y="290" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="rgba(255,255,255,0.9)">${safe.slice(0, 28)}</text>
  <text x="320" y="330" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" fill="rgba(255,255,255,0.7)">${brand}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function createSeedItems(): CollectionItem[] {
  const now = Date.now();
  const mk = (
    i: number,
    partial: Omit<CollectionItem, 'id' | 'createdAt' | 'updatedAt' | 'images' | 'primaryImageIndex'> & { imageLabel?: string }
  ): CollectionItem => {
    const { imageLabel, ...rest } = partial;
    const img = svgPlaceholder(rest.brand, rest.color, imageLabel ?? rest.name);
    return {
      ...rest,
      id: `seed-${i}`,
      images: [img],
      primaryImageIndex: 0,
      createdAt: new Date(now - i * 86400000).toISOString(),
      updatedAt: new Date(now - i * 86400000).toISOString(),
    };
  };

  return [
    mk(1, {
      name: 'Hot Wheels Twin Mill Red',
      sku: 'HW-TM-001',
      modelNumber: '5785',
      brand: 'Hot Wheels',
      category: 'Cars',
      color: 'Red',
      tags: ['Hot Wheels', 'Cars', 'Die-cast', '1:64'],
      customLabels: ['Classic'],
      notes: 'Iconic twin-engine concept.',
      starred: true,
      featured: true,
      isWant: false,
      acquiredAt: '2024-06-12',
    }),
    mk(2, {
      name: 'Lego Technic Bugatti Chiron',
      sku: '42083',
      barcode: '5702016117004',
      brand: 'Lego',
      category: 'Technic',
      color: 'Blue',
      tags: ['Lego', 'Technic', 'Premium'],
      customLabels: ['Display'],
      notes: '3,599 pieces of blue glory.',
      starred: true,
      featured: true,
      isWant: false,
      acquiredAt: '2023-11-02',
    }),
    mk(3, {
      name: 'Matchbox Boeing 747',
      sku: 'MBX-SKY-09',
      brand: 'Matchbox',
      category: 'Flights',
      color: 'White',
      tags: ['Matchbox', 'Flights'],
      customLabels: [],
      notes: 'Sky Hangar regular.',
      starred: false,
      featured: false,
      isWant: false,
    }),
    mk(4, {
      name: 'Hot Wheels F1 Ferrari SF-24',
      sku: 'HW-F1-FER',
      brand: 'Hot Wheels',
      category: 'F1',
      color: 'Red',
      tags: ['Hot Wheels', 'F1', '1:64'],
      customLabels: ['Paddock'],
      notes: 'Rosso corsa forever.',
      starred: true,
      featured: true,
      isWant: false,
    }),
    mk(5, {
      name: 'Lego Creator Expert Modular Corner Garage',
      sku: '10264',
      brand: 'Lego',
      category: 'Sets',
      color: 'Multi',
      tags: ['Lego', 'Sets', 'Minifigs'],
      customLabels: ['Modular'],
      notes: 'Brick Yard centerpiece.',
      starred: false,
      featured: false,
      isWant: false,
    }),
    mk(6, {
      name: 'Hot Wheels Car Culture Boulevard Nissan Skyline',
      sku: 'HRT71',
      brand: 'Hot Wheels',
      category: 'Premium',
      color: 'Silver',
      tags: ['Hot Wheels', 'Premium', 'Car Culture'],
      customLabels: ['JDM'],
      notes: 'Rubber tires, real riders.',
      starred: true,
      featured: false,
      isWant: false,
    }),
    mk(7, {
      name: 'Mattel Hot Wheels Treasure Hunt Bone Shaker',
      sku: 'TH-BS-22',
      brand: 'Hot Wheels',
      category: 'Premium',
      color: 'Black',
      tags: ['Hot Wheels', 'Treasure Hunt', 'Premium'],
      customLabels: ['Chase'],
      notes: 'Still hunting the super.',
      starred: false,
      featured: false,
      isWant: true,
    }),
    mk(8, {
      name: 'Lego Technic Lamborghini Sián FKP 37',
      sku: '42115',
      brand: 'Lego',
      category: 'Technic',
      color: 'Green',
      tags: ['Lego', 'Technic', 'Premium'],
      customLabels: ['Wishlist'],
      notes: 'Green hypercar dream.',
      starred: true,
      featured: false,
      isWant: true,
    }),
  ];
}
