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
    'border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text)]';

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={15} strokeWidth={1.5} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search name, SKU, barcode, tags…"
          className="w-full border border-[var(--border)] bg-[var(--bg-elevated)] py-2.5 pl-9 pr-3 text-sm placeholder:text-[var(--text-muted)]"
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
        <label className="inline-flex items-center gap-1.5 border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-2 text-[11px] font-medium uppercase tracking-[0.08em]">
          <input
            type="checkbox"
            checked={filters.premiumOnly}
            onChange={(e) => onChange({ ...filters, premiumOnly: e.target.checked })}
            className="accent-[#DA291C]"
          />
          Premium
        </label>
        <label className="inline-flex items-center gap-1.5 border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 py-2 text-[11px] font-medium uppercase tracking-[0.08em]">
          <input
            type="checkbox"
            checked={filters.starredOnly}
            onChange={(e) => onChange({ ...filters, starredOnly: e.target.checked })}
            className="accent-[#DA291C]"
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
          <div className="flex border border-[var(--border)] bg-[var(--bg-elevated)]">
            <button
              type="button"
              onClick={() => onViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[#DA291C] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={15} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => onViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[#DA291C] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
              aria-label="List view"
            >
              <List size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
