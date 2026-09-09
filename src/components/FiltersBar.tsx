import { LayoutGrid, List, Search } from 'lucide-react';
import type { Filters, SortKey, ViewMode } from '../types';
import { BRANDS, CATEGORIES, COLORS } from '../types';

export function FiltersBar({
  filters,
  onChange,
  sort,
  onSort,
  viewMode,
  onViewMode,
  allTags,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  viewMode: ViewMode;
  onViewMode: (v: ViewMode) => void;
  allTags: string[];
}) {
  const selectClass =
    'rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-2 text-xs font-semibold text-[var(--text)] sm:text-sm';

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search name, SKU, barcode, tags…"
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] py-2.5 pl-9 pr-3 text-sm shadow-sm"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select className={selectClass} value={filters.brand} onChange={(e) => onChange({ ...filters, brand: e.target.value as Filters['brand'] })}>
          <option value="All">All brands</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select className={selectClass} value={filters.category} onChange={(e) => onChange({ ...filters, category: e.target.value as Filters['category'] })}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className={selectClass} value={filters.color} onChange={(e) => onChange({ ...filters, color: e.target.value as Filters['color'] })}>
          <option value="All">All colors</option>
          {COLORS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className={selectClass} value={filters.tag} onChange={(e) => onChange({ ...filters, tag: e.target.value })}>
          <option value="All">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <label className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-2 text-xs font-semibold">
          <input
            type="checkbox"
            checked={filters.premiumOnly}
            onChange={(e) => onChange({ ...filters, premiumOnly: e.target.checked })}
          />
          Premium
        </label>
        <label className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-2 text-xs font-semibold">
          <input
            type="checkbox"
            checked={filters.starredOnly}
            onChange={(e) => onChange({ ...filters, starredOnly: e.target.checked })}
          />
          Starred
        </label>
        <div className="ml-auto flex items-center gap-2">
          <select className={selectClass} value={sort} onChange={(e) => onSort(e.target.value as SortKey)}>
            <option value="date">Sort: Date</option>
            <option value="name">Sort: Name</option>
            <option value="brand">Sort: Brand</option>
            <option value="color">Sort: Color</option>
          </select>
          <div className="flex rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-0.5">
            <button
              type="button"
              onClick={() => onViewMode('grid')}
              className={`rounded-lg p-2 ${viewMode === 'grid' ? 'bg-stud-red text-white' : ''}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => onViewMode('list')}
              className={`rounded-lg p-2 ${viewMode === 'list' ? 'bg-stud-red text-white' : ''}`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
