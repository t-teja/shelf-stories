import type { ColorFamily } from '../types';
import { COLOR_HEX } from '../types';

export function ColorChip({ color, label }: { color: ColorFamily; label?: boolean }) {
  const hex = COLOR_HEX[color];
  const border = color === 'White' || color === 'Yellow' ? '1px solid #D4D0C8' : '1px solid transparent';
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
      <span
        className="inline-block h-3.5 w-3.5 rounded-full shadow-sm"
        style={{ background: hex, border }}
        title={color}
      />
      {label !== false && <span>{color}</span>}
    </span>
  );
}
