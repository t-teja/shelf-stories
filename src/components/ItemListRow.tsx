import { Star, Pencil, Trash2, ExternalLink } from 'lucide-react';
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
  const qty = item.quantity ?? 1;
  const showPrice = item.price != null && !Number.isNaN(item.price);

  return (
    <div className="panel flex items-center gap-3 p-2.5 animate-in sm:gap-4 sm:p-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden border border-[var(--border)] bg-[var(--bg-soft)] sm:h-16 sm:w-16">
        {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-display text-sm font-medium tracking-wide sm:text-base">{item.name}</h3>
          <BrandBadge brand={item.brand} />
          {qty > 1 && (
            <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">×{qty}</span>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
          <span>{item.category}</span>
          <ColorChip color={item.color} />
          {item.sku && <span className="font-mono normal-case tracking-wider">{item.sku}</span>}
          {showPrice && <span className="font-mono normal-case tracking-wider">{item.price!.toFixed(2)}</span>}
          {item.purchasedFrom && (
            <span className="normal-case tracking-normal opacity-70">{item.purchasedFrom}</span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        {item.productLink && (
          <a
            href={item.productLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--text)]"
            aria-label="Product link"
          >
            <ExternalLink size={15} strokeWidth={1.5} />
          </a>
        )}
        <button type="button" onClick={() => onToggleStar(item)} className="p-2 hover:bg-[var(--bg-soft)]" aria-label="Star">
          <Star size={15} strokeWidth={1.5} className={item.starred ? 'fill-[#DA291C] text-[#DA291C]' : 'text-[var(--text-muted)]'} />
        </button>
        <button type="button" onClick={() => onEdit(item)} className="p-2 hover:bg-[var(--bg-soft)]" aria-label="Edit">
          <Pencil size={15} strokeWidth={1.5} />
        </button>
        <button type="button" onClick={() => onDelete(item)} className="p-2 text-[#DA291C] hover:bg-[#DA291C]/10" aria-label="Delete">
          <Trash2 size={15} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
