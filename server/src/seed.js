/** Seed items mirrored from frontend src/lib/seed.ts — owned starters + demo flavor. */

function svgPlaceholder(brand, color, label) {
  const brandHex = {
    'Hot Wheels': '#E31C23',
    Lego: '#FFD500',
    Matchbox: '#F97316',
    Mattel: '#00A3E0',
    Other: '#8B5CF6',
  };
  const colorHex = {
    Red: '#E31C23', Blue: '#00A3E0', Yellow: '#FFD500', Green: '#22C55E',
    Orange: '#F97316', Purple: '#8B5CF6', Black: '#374151', White: '#E2E8F0',
    Silver: '#94A3B8', Gold: '#EAB308', Pink: '#EC4899', Multi: '#A855F7', Other: '#64748B',
  };
  const initials = brand === 'Hot Wheels' ? 'HW' : brand === 'Matchbox' ? 'MB' : brand.charAt(0);
  const c1 = brandHex[brand] ?? '#E31C23';
  const c2 = colorHex[color] ?? '#00A3E0';
  const safe = String(label).replace(/[<>&']/g, '');
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
  <text x="320" y="220" text-anchor="middle" font-family="system-ui,sans-serif" font-size="72" font-weight="800" fill="rgba(255,255,255,0.95)">${initials}</text>
  <text x="320" y="290" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="rgba(255,255,255,0.9)">${safe.slice(0, 28)}</text>
  <text x="320" y="330" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" fill="rgba(255,255,255,0.7)">${brand}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function mk(i, partial) {
  const now = Date.now();
  const { imageLabel, id, ...rest } = partial;
  const img = svgPlaceholder(rest.brand, rest.color, imageLabel ?? rest.name);
  return {
    ...rest,
    id: id ?? `seed-${i}`,
    images: [img],
    primaryImageIndex: 0,
    createdAt: new Date(now - i * 86400000).toISOString(),
    updatedAt: new Date(now - i * 86400000).toISOString(),
  };
}

export function createSeedItems() {
  return [
    mk(1, {
      id: 'seed-beluga-21346',
      name: 'LEGO Icons Beluga Cargo Flight',
      sku: '21346',
      modelNumber: '21346',
      brand: 'Lego',
      category: 'Flights',
      color: 'White',
      tags: ['Lego', 'Icons', 'Flights', 'Beluga', 'Cargo', 'Plane', 'Airbus'],
      customLabels: ['Owned', 'Sky Hangar'],
      notes: 'Beluga cargo flight — Airbus Beluga-style Icons plane. Marked owned for duplicate detection (Beluga / 21346 / cargo flight).',
      starred: true,
      featured: true,
      isWant: false,
      acquiredAt: '2024-08-15',
      imageLabel: 'Beluga Cargo',
    }),
    mk(2, {
      id: 'seed-daytona-technic-42143',
      name: 'LEGO Technic Ferrari Daytona SP3',
      sku: '42143',
      modelNumber: '42143',
      barcode: '5702017156835',
      brand: 'Lego',
      category: 'Technic',
      color: 'Red',
      tags: ['Lego', 'Technic', 'Daytona', 'Ferrari', 'Supercar', 'Premium'],
      customLabels: ['Owned', 'Display'],
      notes: 'Daytona Technic — Ferrari Daytona SP3 (42143). Flagship Technic supercar, owned.',
      starred: true,
      featured: true,
      isWant: false,
      acquiredAt: '2024-05-20',
      imageLabel: 'Daytona Technic',
    }),
    mk(3, {
      id: 'seed-f1-2024-redbull-77242',
      name: 'LEGO Speed Champions Oracle Red Bull Racing RB20 F1',
      sku: '77242',
      modelNumber: '77242',
      brand: 'Lego',
      category: 'F1',
      color: 'Blue',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Red Bull'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 collection — Oracle Red Bull Racing RB20.',
      starred: true,
      featured: true,
      isWant: false,
      acquiredAt: '2024-03-01',
      imageLabel: 'RB20 F1',
    }),
    mk(4, {
      id: 'seed-f1-2024-mercedes-77243',
      name: 'LEGO Speed Champions Mercedes-AMG PETRONAS F1 W15',
      sku: '77243',
      modelNumber: '77243',
      brand: 'Lego',
      category: 'F1',
      color: 'Silver',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Mercedes'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 collection — Mercedes-AMG PETRONAS W15.',
      starred: true,
      featured: false,
      isWant: false,
      acquiredAt: '2024-03-01',
      imageLabel: 'W15 F1',
    }),
    mk(5, {
      id: 'seed-f1-2024-ferrari-77244',
      name: 'LEGO Speed Champions Scuderia Ferrari SF-24 F1',
      sku: '77244',
      modelNumber: '77244',
      brand: 'Lego',
      category: 'F1',
      color: 'Red',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Ferrari'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 collection — Scuderia Ferrari SF-24.',
      starred: true,
      featured: true,
      isWant: false,
      acquiredAt: '2024-03-08',
      imageLabel: 'SF-24 F1',
    }),
    mk(6, {
      id: 'seed-f1-2024-mclaren-77245',
      name: 'LEGO Speed Champions McLaren MCL38 F1',
      sku: '77245',
      modelNumber: '77245',
      brand: 'Lego',
      category: 'F1',
      color: 'Orange',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'McLaren'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 collection — McLaren Formula 1 Team MCL38.',
      starred: true,
      featured: false,
      isWant: false,
      acquiredAt: '2024-03-15',
      imageLabel: 'MCL38 F1',
    }),
    mk(7, {
      id: 'seed-f1-2024-aston-77247',
      name: 'LEGO Speed Champions Aston Martin AMR24 F1',
      sku: '77247',
      modelNumber: '77247',
      brand: 'Lego',
      category: 'F1',
      color: 'Green',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Aston Martin'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 collection — Aston Martin Aramco AMR24.',
      starred: false,
      featured: false,
      isWant: false,
      acquiredAt: '2024-04-02',
      imageLabel: 'AMR24 F1',
    }),
    mk(8, {
      id: 'seed-f1-2024-alpine-77248',
      name: 'LEGO Speed Champions BWT Alpine F1 A524',
      sku: '77248',
      modelNumber: '77248',
      brand: 'Lego',
      category: 'F1',
      color: 'Pink',
      tags: ['Lego', 'F1', 'Speed Champions', '2024', 'Alpine'],
      customLabels: ['Owned', 'Paddock', 'F1 2024'],
      notes: '2024 F1 collection — BWT Alpine A524.',
      starred: false,
      featured: false,
      isWant: false,
      acquiredAt: '2024-04-10',
      imageLabel: 'A524 F1',
    }),
    mk(9, {
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
    mk(10, {
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
    mk(11, {
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
    mk(12, {
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
    mk(13, {
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
