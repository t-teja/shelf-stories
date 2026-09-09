import { Star, Sparkles, Trash2, Pencil } from 'lucide-react';
import type { CollectionItem } from '../types';
import { BrandBadge } from './BrandBadge';
import { ColorChip } from './ColorChip';

export function ItemCard({
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
    <article className="clay-card group overflow-hidden animate-in">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-soft)]">
        {cover ? (
          <img src={cover} alt={item.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--text-muted)]">No image</div>
        )}
        <div className="absolute left-2 top-2 flex gap-1">
          <BrandBadge brand={item.brand} />
          {item.featured && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-brick-yellow px-2 py-0.5 text-[10px] font-bold text-ink">
              <Sparkles size={10} /> Featured
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onToggleStar(item)}
          className="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur transition hover:bg-black/60"
          aria-label={item.starred ? 'Unstar' : 'Star'}
        >
          <Star size={16} className={item.starred ? 'fill-brick-yellow text-brick-yellow' : ''} />
        </button>
      </div>
      <div className="space-y-2 p-3.5 text-left">
        <h3 className="line-clamp-2 font-display text-sm font-bold leading-snug text-[var(--text)]">{item.name}</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
          <span className="rounded-md bg-[var(--bg-soft)] px-1.5 py-0.5">{item.category}</span>
          <ColorChip color={item.color} />
        </div>
        {(item.sku || item.modelNumber) && (
          <p className="truncate font-mono text-[11px] text-[var(--text-muted)]">
            {item.sku || item.modelNumber}
          </p>
        )}
        <div className="flex gap-2 pt-1 opacity-80 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-[var(--bg-soft)] px-2 py-1.5 text-xs font-semibold hover:bg-sky-blue/15"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--bg-soft)] px-2 py-1.5 text-xs font-semibold text-stud-red hover:bg-stud-red/10"
            aria-label="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </article>
  );
}
