import { Star, Sparkles, Trash2, Pencil, ExternalLink } from 'lucide-react';
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
  const qty = item.quantity ?? 1;
  const showPrice = item.price != null && !Number.isNaN(item.price);
  const code = item.sku || item.modelNumber;

  return (
    <article className="panel group overflow-hidden animate-in">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-soft)]">
        {cover ? (
          <img src={cover} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)]">No image</div>
        )}
        <div className="absolute left-2 top-2 flex gap-1.5">
          <BrandBadge brand={item.brand} />
          {item.featured && (
            <span className="inline-flex items-center gap-0.5 border border-[#DA291C]/80 bg-black/60 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-white backdrop-blur-sm">
              <Sparkles size={9} /> Featured
            </span>
          )}
          {qty > 1 && (
            <span className="border border-white/10 bg-black/50 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-white backdrop-blur-sm">
              ×{qty}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onToggleStar(item)}
          className="absolute right-2 top-2 border border-white/10 bg-black/50 p-1.5 text-white backdrop-blur-sm transition hover:border-[#DA291C]/60"
          aria-label={item.starred ? 'Unstar' : 'Star'}
        >
          <Star size={14} className={item.starred ? 'fill-[#DA291C] text-[#DA291C]' : ''} strokeWidth={1.5} />
        </button>
      </div>
      <div className="space-y-2.5 p-3.5 text-left">
        <h3 className="line-clamp-2 font-display text-[15px] font-medium leading-snug tracking-wide text-[var(--text)]">{item.name}</h3>
        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
          <span className="border border-[var(--border)] px-1.5 py-0.5">{item.category}</span>
          <ColorChip color={item.color} />
          {showPrice && (
            <span className="font-mono normal-case tracking-wider">{item.price!.toFixed(2)}</span>
          )}
        </div>
        {(code || item.purchasedFrom) && (
          <p className="truncate text-[10px] tracking-wider text-[var(--text-muted)]">
            {code && <span className="font-mono">{code}</span>}
            {code && item.purchasedFrom && <span className="mx-1.5 opacity-40">·</span>}
            {item.purchasedFrom && (
              <span className="font-sans normal-case tracking-normal opacity-70">{item.purchasedFrom}</span>
            )}
          </p>
        )}
        <div className="flex gap-2 pt-1 opacity-70 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="inline-flex flex-1 items-center justify-center gap-1 border border-[var(--border)] px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] hover:border-[var(--text)]"
          >
            <Pencil size={11} strokeWidth={1.5} /> Edit
          </button>
          {item.productLink && (
            <a
              href={item.productLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-[var(--border)] px-2 py-1.5 text-[10px] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]"
              aria-label="Product link"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={11} strokeWidth={1.5} />
            </a>
          )}
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="inline-flex items-center justify-center border border-[var(--border)] px-2 py-1.5 text-[10px] text-[#DA291C] hover:border-[#DA291C]/50"
            aria-label="Delete"
          >
            <Trash2 size={11} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  );
}
