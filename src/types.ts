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

/** Understated brand accents — used sparingly for tiny indicators only */
export const BRAND_COLORS: Record<Brand, string> = {
  'Hot Wheels': '#DA291C',
  Lego: '#8F8F8F',
  Matchbox: '#A0A0A0',
  Mattel: '#B0B0B0',
  Other: '#6B6B6B',
};

export const COLOR_HEX: Record<ColorFamily, string> = {
  Red: '#DA291C',
  Blue: '#4A6FA5',
  Yellow: '#C4A35A',
  Green: '#4F7A5A',
  Orange: '#B86B3D',
  Purple: '#6B5B7A',
  Black: '#1A1A1A',
  White: '#F5F5F5',
  Silver: '#8F8F8F',
  Gold: '#B8963E',
  Pink: '#A86B7A',
  Multi: '#6B6B6B',
  Other: '#6B6B6B',
};

export const ROOMS: { id: Room; label: string; hint: string }[] = [
  { id: 'all', label: 'The Collection', hint: 'Full inventory' },
  { id: 'garage', label: 'Garage', hint: 'Cars · Hot Wheels · Matchbox' },
  { id: 'brickyard', label: 'Brick Yard', hint: 'Lego · Technic · Sets' },
  { id: 'treasure', label: 'Vault', hint: 'Premium & starred pieces' },
  { id: 'sky', label: 'Hangar', hint: 'Flights & aviation' },
  { id: 'paddock', label: 'Paddock', hint: 'Formula 1 machines' },
  { id: 'want', label: 'Wishlist', hint: 'Acquisitions ahead' },
  { id: 'studmap', label: 'Gallery Wall', hint: 'Visual cover grid' },
  { id: 'tv', label: 'Showcase', hint: 'Cinematic presentation' },
];
