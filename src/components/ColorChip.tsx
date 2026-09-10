import type { ColorFamily } from '../types';
import { COLOR_HEX } from '../types';

export function ColorChip({ color, label }: { color: ColorFamily; label?: boolean }) {
  const hex = COLOR_HEX[color];
  const border = color === 'White' || color === 'Yellow' || color === 'Silver'
    ? '1px solid #4A4A4A'
    : '1px solid transparent';
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: hex, border }}
        title={color}
      />
      {label !== false && <span>{color}</span>}
    </span>
  );
}
