import type { Brand } from '../types';

export function BrandBadge({ brand, size = 'sm' }: { brand: Brand; size?: 'sm' | 'md' }) {
  return (
    <span
      className={`inline-flex items-center border border-[var(--border)] bg-transparent font-medium uppercase tracking-[0.1em] text-[var(--text-muted)] ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
      }`}
    >
      {brand}
    </span>
  );
}
