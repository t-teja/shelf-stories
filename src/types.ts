export type Brand = 'Hot Wheels' | 'Lego' | 'Matchbox' | 'Mattel' | 'Other';
export type Category = 'Cars' | 'Flights' | 'F1' | 'Technic' | 'Premium' | 'Sets' | 'Other';
export type ColorFamily =
  | 'Red' | 'Blue' | 'Yellow' | 'Green' | 'Orange' | 'Purple'
  | 'Black' | 'White' | 'Silver' | 'Gold' | 'Pink' | 'Multi' | 'Other';

export type Room =
  | 'all'
  | 'garage'
  | 'brickyard'
  | 'treasure'
  | 'sky'
  | 'paddock'
  | 'want'
  | 'tv'
  | 'studmap';

export interface CollectionItem {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  modelNumber?: string;
  brand: Brand;
  category: Category;
  color: ColorFamily;
  tags: string[];
  customLabels: string[];
  images: string[]; // data URLs or remote URLs
  primaryImageIndex: number;
  notes?: string;
  starred: boolean;
  featured: boolean;
  isWant: boolean;
  acquiredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type SortKey = 'name' | 'date' | 'color' | 'brand';
export type ViewMode = 'grid' | 'list';

export interface Filters {
  brand: Brand | 'All';
  category: Category | 'All';
  color: ColorFamily | 'All';
  tag: string | 'All';
  premiumOnly: boolean;
  starredOnly: boolean;
  search: string;
}

export const BRANDS: Brand[] = ['Hot Wheels', 'Lego', 'Matchbox', 'Mattel', 'Other'];
export const CATEGORIES: Category[] = ['Cars', 'Flights', 'F1', 'Technic', 'Premium', 'Sets', 'Other'];
export const COLORS: ColorFamily[] = [
  'Red', 'Blue', 'Yellow', 'Green', 'Orange', 'Purple',
  'Black', 'White', 'Silver', 'Gold', 'Pink', 'Multi', 'Other',
];

export const BRAND_COLORS: Record<Brand, string> = {
  'Hot Wheels': '#E31C23',
  Lego: '#FFD500',
  Matchbox: '#F97316',
  Mattel: '#00A3E0',
  Other: '#8B5CF6',
};

export const COLOR_HEX: Record<ColorFamily, string> = {
  Red: '#E31C23',
  Blue: '#00A3E0',
  Yellow: '#FFD500',
  Green: '#22C55E',
  Orange: '#F97316',
  Purple: '#8B5CF6',
  Black: '#1F2937',
  White: '#F8FAFC',
  Silver: '#94A3B8',
  Gold: '#EAB308',
  Pink: '#EC4899',
  Multi: '#A855F7',
  Other: '#64748B',
};

export const ROOMS: { id: Room; label: string; hint: string }[] = [
  { id: 'all', label: 'All Library', hint: 'Everything on the shelves' },
  { id: 'garage', label: 'Garage', hint: 'Cars · Hot Wheels · Matchbox' },
  { id: 'brickyard', label: 'Brick Yard', hint: 'Lego · Technic · Sets' },
  { id: 'treasure', label: 'Treasure Room', hint: 'Premium & starred finds' },
  { id: 'sky', label: 'Sky Hangar', hint: 'Flights & sky toys' },
  { id: 'paddock', label: 'Paddock', hint: 'Formula 1 machines' },
  { id: 'want', label: 'Want List', hint: 'Dreams still hunting' },
  { id: 'studmap', label: 'Stud Map', hint: 'Visual wall of covers' },
  { id: 'tv', label: 'TV Showcase', hint: 'Cinema slideshow mode' },
];
