import { Star, Pencil, Trash2 } from 'lucide-react';
import type { CollectionItem } from '../types';
import { BrandBadge } from './BrandBadge';
import { ColorChip } from './ColorChip';

export function ItemListRow({
  item,
  onEdit,
  onToggleStar,
  onDelete,
}: {
  item: CollectionItem;
  onEdit: (item: CollectionItem) => void;
  onToggleStar: (item: CollectionItem) => void;
  onDelete: (item: CollectionItem) => void;
}) {
  const cover = item.images[item.primaryImageIndex] ?? item.images[0];
  return (
    <div className="clay-card flex items-center gap-3 p-2.5 animate-in sm:gap-4 sm:p-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--bg-soft)] sm:h-16 sm:w-16">
        {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-display text-sm font-bold sm:text-base">{item.name}</h3>
          <BrandBadge brand={item.brand} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
          <span>{item.category}</span>
          <ColorChip color={item.color} />
          {item.sku && <span className="font-mono">{item.sku}</span>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button type="button" onClick={() => onToggleStar(item)} className="rounded-lg p-2 hover:bg-[var(--bg-soft)]" aria-label="Star">
          <Star size={16} className={item.starred ? 'fill-brick-yellow text-brick-yellow' : 'text-[var(--text-muted)]'} />
        </button>
        <button type="button" onClick={() => onEdit(item)} className="rounded-lg p-2 hover:bg-[var(--bg-soft)]" aria-label="Edit">
          <Pencil size={16} />
        </button>
        <button type="button" onClick={() => onDelete(item)} className="rounded-lg p-2 text-stud-red hover:bg-stud-red/10" aria-label="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
