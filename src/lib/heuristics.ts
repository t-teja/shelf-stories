import type { Brand, Category, ColorFamily } from '../types';

const brandPatterns: { brand: Brand; patterns: RegExp[] }[] = [
  { brand: 'Hot Wheels', patterns: [/hot\s*wheels?/i, /\bhw\b/i, /mattel\s*hot/i] },
  { brand: 'Lego', patterns: [/\blego\b/i, /technic/i, /\blegends\b/i, /ninjago/i, /creator/i] },
  { brand: 'Matchbox', patterns: [/match\s*box/i, /\bmbx\b/i] },
  { brand: 'Mattel', patterns: [/mattel/i, /barbie/i, /masters of the universe/i] },
];

const categoryPatterns: { category: Category; patterns: RegExp[] }[] = [
  { category: 'F1', patterns: [/\bf1\b/i, /formula\s*1/i, /grand\s*prix/i, /ferrari\s*f1/i, /red\s*bull\s*racing/i] },
  { category: 'Flights', patterns: [/plane|jet|helicopter|aircraft|airplane|sky|flight|chopper|boeing|airbus/i] },
  { category: 'Technic', patterns: [/technic/i] },
  { category: 'Premium', patterns: [/premium|rls|boulevard|car culture|super treasure|chase|exclusive|limited/i] },
  { category: 'Cars', patterns: [/car|truck|van|coupe|muscle|porsche|mustang|camaro|corvette|bmw|mercedes|toyota|nissan|honda|jeep|pickup/i] },
  { category: 'Sets', patterns: [/set|creator|architecture|modular|minifig/i] },
];

const colorPatterns: { color: ColorFamily; patterns: RegExp[] }[] = [
  { color: 'Red', patterns: [/\bred\b|crimson|scarlet|cherry|rosso/i] },
  { color: 'Blue', patterns: [/\bblue\b|azure|navy|cyan|teal|sky/i] },
  { color: 'Yellow', patterns: [/\byellow\b|gold.?yellow|lemon|banana/i] },
  { color: 'Green', patterns: [/\bgreen\b|lime|emerald|forest/i] },
  { color: 'Orange', patterns: [/\borange\b|tangerine|amber/i] },
  { color: 'Purple', patterns: [/\bpurple\b|violet|magenta|lilac/i] },
  { color: 'Black', patterns: [/\bblack\b|midnight|noir|ebony/i] },
  { color: 'White', patterns: [/\bwhite\b|pearl|ivory|cream/i] },
  { color: 'Silver', patterns: [/\bsilver\b|chrome|metallic|grey|gray|steel/i] },
  { color: 'Gold', patterns: [/\bgold\b|golden|bronze/i] },
  { color: 'Pink', patterns: [/\bpink\b|rose|magenta/i] },
  { color: 'Multi', patterns: [/multi|rainbow|camo|spectrum/i] },
];

function matchFirst<T>(text: string, groups: { patterns: RegExp[]; }[], pick: (g: typeof groups[number]) => T, fallback: T): T {
  for (const g of groups) {
    if (g.patterns.some((p) => p.test(text))) return pick(g);
  }
  return fallback;
}

export function detectBrand(text: string): Brand {
  return matchFirst(text, brandPatterns, (g) => (g as typeof brandPatterns[number]).brand, 'Other');
}

export function detectCategory(text: string, brand: Brand): Category {
  const found = matchFirst(text, categoryPatterns, (g) => (g as typeof categoryPatterns[number]).category, null as Category | null);
  if (found) return found;
  if (brand === 'Lego') return 'Sets';
  if (brand === 'Hot Wheels' || brand === 'Matchbox') return 'Cars';
  return 'Other';
}

export function detectColor(text: string): ColorFamily {
  return matchFirst(text, colorPatterns, (g) => (g as typeof colorPatterns[number]).color, 'Other');
}

export function suggestTags(text: string, brand: Brand, category: Category): string[] {
  const tags = new Set<string>();
  if (brand !== 'Other') tags.add(brand);
  tags.add(category);
  if (/treasure|chase|th/i.test(text)) tags.add('Treasure Hunt');
  if (/premium|boulevard|car culture/i.test(text)) tags.add('Premium');
  if (/die.?cast/i.test(text)) tags.add('Die-cast');
  if (/1:64|164/i.test(text)) tags.add('1:64');
  if (/minifig/i.test(text)) tags.add('Minifigs');
  return Array.from(tags);
}

export function analyzeItemText(input: {
  name: string;
  sku?: string;
  barcode?: string;
  modelNumber?: string;
  notes?: string;
}): { brand: Brand; category: Category; color: ColorFamily; tags: string[] } {
  const blob = [input.name, input.sku, input.barcode, input.modelNumber, input.notes]
    .filter(Boolean)
    .join(' ');
  const brand = detectBrand(blob);
  const category = detectCategory(blob, brand);
  const color = detectColor(blob);
  const tags = suggestTags(blob, brand, category);
  return { brand, category, color, tags };
}

export function placeholderGradient(brand: Brand, color: ColorFamily): string {
  const brandHex: Record<Brand, string> = {
    'Hot Wheels': '#DA291C',
    Lego: '#2A2A2A',
    Matchbox: '#3A3A3A',
    Mattel: '#444444',
    Other: '#333333',
  };
  const colorHex: Record<ColorFamily, string> = {
    Red: '#DA291C', Blue: '#2A3A4A', Yellow: '#3A3420', Green: '#1E2E24',
    Orange: '#3A2818', Purple: '#2A2430', Black: '#111111', White: '#2A2A2A',
    Silver: '#2A2A2A', Gold: '#3A3020', Pink: '#2E2024', Multi: '#222222', Other: '#1A1A1A',
  };
  return `linear-gradient(135deg, ${brandHex[brand]} 0%, ${colorHex[color]} 100%)`;
}

export function brandInitial(brand: Brand): string {
  if (brand === 'Hot Wheels') return 'HW';
  if (brand === 'Matchbox') return 'MB';
  return brand.charAt(0);
}

/** Similarity check for duplicate warnings */
export function isSimilar(a: string, b: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const na = norm(a);
  const nb = norm(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;
  // simple token overlap
  const ta = new Set(a.toLowerCase().split(/\s+/).filter((t) => t.length > 2));
  const tb = b.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  if (ta.size === 0 || tb.length === 0) return false;
  const overlap = tb.filter((t) => ta.has(t)).length;
  return overlap / Math.max(ta.size, tb.length) >= 0.7;
}
