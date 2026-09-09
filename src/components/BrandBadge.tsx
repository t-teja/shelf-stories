import type { Brand } from '../types';
import { BRAND_COLORS } from '../types';

export function BrandBadge({ brand, size = 'sm' }: { brand: Brand; size?: 'sm' | 'md' }) {
  const bg = BRAND_COLORS[brand];
  const textColor = brand === 'Lego' || brand === 'Matchbox' ? '#1A1523' : '#fff';
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold tracking-wide ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      style={{ background: bg, color: textColor }}
    >
      {brand}
    </span>
  );
}
