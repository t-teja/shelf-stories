import type { CollectionItem } from '../types';
import { EmptyState } from './EmptyState';

export function StudMap({
  items,
  onSelect,
}: {
  items: CollectionItem[];
  onSelect: (item: CollectionItem) => void;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Empty gallery wall"
        hint="Add covers to your collection and they will tile into an editorial wall of pieces."
      />
    );
  }

  return (
    <div className="animate-in">
      <div className="mb-6">
        <p className="label-caps text-[var(--text-muted)]">Gallery Wall</p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          A visual grid of every cover — select a piece to open it.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
        {items.map((item) => {
          const cover = item.images[item.primaryImageIndex] ?? item.images[0];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              title={item.name}
              className="group relative aspect-square overflow-hidden border border-[var(--border)] bg-[var(--bg-soft)] transition hover:border-[#DA291C]/70"
            >
              {cover && (
                <img src={cover} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              )}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-left text-[9px] font-medium uppercase tracking-[0.08em] text-white opacity-0 transition group-hover:opacity-100">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
