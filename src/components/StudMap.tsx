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
        title="Empty stud wall"
        hint="Add covers to your collection and they'll tile into a colorful museum wall."
      />
    );
  }

  return (
    <div className="animate-in">
      <p className="mb-4 text-sm text-[var(--text-muted)]">
        A visual wall of every cover — click a stud to open it.
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
        {items.map((item) => {
          const cover = item.images[item.primaryImageIndex] ?? item.images[0];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              title={item.name}
              className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-soft)] shadow-sm transition hover:-translate-y-1 hover:border-stud-red hover:shadow-lg"
            >
              {cover && (
                <img src={cover} alt={item.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-110" />
              )}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 text-left text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
