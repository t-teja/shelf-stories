import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ImagePlus, Star, Sparkles, Trash2, X } from 'lucide-react';
import type { Brand, Category, CollectionItem, ColorFamily } from '../types';
import { BRANDS, CATEGORIES, COLORS } from '../types';
import { analyzeItemText, brandInitial, placeholderGradient } from '../lib/heuristics';
import { BrandBadge } from './BrandBadge';

function uid() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makePlaceholder(brand: Brand, color: ColorFamily, name: string): string {
  const brandHex: Record<Brand, string> = {
    'Hot Wheels': '#E31C23', Lego: '#FFD500', Matchbox: '#F97316', Mattel: '#00A3E0', Other: '#8B5CF6',
  };
  const colorHex: Record<ColorFamily, string> = {
    Red: '#E31C23', Blue: '#00A3E0', Yellow: '#FFD500', Green: '#22C55E', Orange: '#F97316',
    Purple: '#8B5CF6', Black: '#374151', White: '#E2E8F0', Silver: '#94A3B8', Gold: '#EAB308',
    Pink: '#EC4899', Multi: '#A855F7', Other: '#64748B',
  };
  const c1 = brandHex[brand];
  const c2 = colorHex[color];
  const initial = brandInitial(brand);
  const safe = (name || 'New Item').slice(0, 28).replace(/[<>&]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="640" height="480" rx="28" fill="url(#g)"/><text x="320" y="220" text-anchor="middle" font-family="system-ui" font-size="72" font-weight="800" fill="#fff">${initial}</text><text x="320" y="290" text-anchor="middle" font-family="system-ui" font-size="26" font-weight="700" fill="#fff">${safe}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type Draft = {
  name: string;
  sku: string;
  barcode: string;
  modelNumber: string;
  brand: Brand;
  category: Category;
  color: ColorFamily;
  tags: string;
  customLabels: string;
  notes: string;
  imageUrl: string;
  images: string[];
  primaryImageIndex: number;
  starred: boolean;
  featured: boolean;
  isWant: boolean;
  acquiredAt: string;
};

function itemToDraft(item?: CollectionItem | null, initialWant = false): Draft {
  if (!item) {
    return {
      name: '', sku: '', barcode: '', modelNumber: '', brand: 'Other', category: 'Other', color: 'Other',
      tags: '', customLabels: '', notes: '', imageUrl: '', images: [], primaryImageIndex: 0,
      starred: false, featured: false, isWant: initialWant, acquiredAt: '',
    };
  }
  return {
    name: item.name,
    sku: item.sku ?? '',
    barcode: item.barcode ?? '',
    modelNumber: item.modelNumber ?? '',
    brand: item.brand,
    category: item.category,
    color: item.color,
    tags: item.tags.join(', '),
    customLabels: item.customLabels.join(', '),
    notes: item.notes ?? '',
    imageUrl: '',
    images: [...item.images],
    primaryImageIndex: item.primaryImageIndex,
    starred: item.starred,
    featured: item.featured,
    isWant: item.isWant,
    acquiredAt: item.acquiredAt ?? '',
  };
}

export function AddItemModal({
  open,
  onClose,
  onSave,
  editing,
  duplicates,
  initialWant = false,
  onDraftChange,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (item: CollectionItem) => void;
  editing?: CollectionItem | null;
  duplicates: CollectionItem[];
  initialWant?: boolean;
  onDraftChange?: (d: { name: string; sku: string; barcode: string; modelNumber: string }) => void;
}) {
  const [draft, setDraft] = useState<Draft>(itemToDraft(editing, initialWant));
  const [autoApplied, setAutoApplied] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(itemToDraft(editing, initialWant));
      setAutoApplied(false);
    }
  }, [open, editing, initialWant]);

  useEffect(() => {
    onDraftChange?.({
      name: draft.name,
      sku: draft.sku,
      barcode: draft.barcode,
      modelNumber: draft.modelNumber,
    });
  }, [draft.name, draft.sku, draft.barcode, draft.modelNumber, onDraftChange]);

  useEffect(() => {
    if (!open || editing) return;
    const t = setTimeout(() => {
      const text = [draft.name, draft.sku, draft.barcode, draft.modelNumber, draft.notes].join(' ');
      if (text.trim().length < 3) return;
      const guessed = analyzeItemText({
        name: draft.name,
        sku: draft.sku,
        barcode: draft.barcode,
        modelNumber: draft.modelNumber,
        notes: draft.notes,
      });
      setDraft((d) => ({
        ...d,
        brand: !autoApplied || d.brand === 'Other' ? guessed.brand : d.brand,
        category: !autoApplied || d.category === 'Other' ? guessed.category : d.category,
        color: !autoApplied || d.color === 'Other' ? guessed.color : d.color,
        tags: d.tags.trim() ? d.tags : guessed.tags.join(', '),
      }));
      setAutoApplied(true);
    }, 350);
    return () => clearTimeout(t);
  }, [draft.name, draft.sku, draft.barcode, draft.modelNumber, draft.notes, open, editing, autoApplied]);

  const preview = useMemo(() => {
    if (draft.images[draft.primaryImageIndex]) return draft.images[draft.primaryImageIndex];
    if (draft.images[0]) return draft.images[0];
    return makePlaceholder(draft.brand, draft.color, draft.name || 'New Item');
  }, [draft]);

  if (!open) return null;

  const splitList = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

  const addImageUrl = () => {
    const url = draft.imageUrl.trim();
    if (!url) return;
    setDraft((d) => ({
      ...d,
      images: [...d.images, url],
      primaryImageIndex: d.images.length === 0 ? 0 : d.primaryImageIndex,
      imageUrl: '',
    }));
  };

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      urls.push(await fileToDataUrl(file));
    }
    if (!urls.length) return;
    setDraft((d) => ({
      ...d,
      images: [...d.images, ...urls],
      primaryImageIndex: d.images.length === 0 ? 0 : d.primaryImageIndex,
    }));
  };

  const removeImage = (idx: number) => {
    setDraft((d) => {
      const images = d.images.filter((_, i) => i !== idx);
      let primaryImageIndex = d.primaryImageIndex;
      if (primaryImageIndex >= images.length) primaryImageIndex = Math.max(0, images.length - 1);
      if (idx < d.primaryImageIndex) primaryImageIndex = Math.max(0, d.primaryImageIndex - 1);
      return { ...d, images, primaryImageIndex };
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) return;
    const now = new Date().toISOString();
    let images = [...draft.images];
    if (images.length === 0) {
      images = [makePlaceholder(draft.brand, draft.color, draft.name)];
    }
    const item: CollectionItem = {
      id: editing?.id ?? uid(),
      name: draft.name.trim(),
      sku: draft.sku.trim() || undefined,
      barcode: draft.barcode.trim() || undefined,
      modelNumber: draft.modelNumber.trim() || undefined,
      brand: draft.brand,
      category: draft.category,
      color: draft.color,
      tags: splitList(draft.tags),
      customLabels: splitList(draft.customLabels),
      images,
      primaryImageIndex: Math.min(draft.primaryImageIndex, images.length - 1),
      notes: draft.notes.trim() || undefined,
      starred: draft.starred,
      featured: draft.featured,
      isWant: draft.isWant,
      acquiredAt: draft.acquiredAt || undefined,
      createdAt: editing?.createdAt ?? now,
      updatedAt: now,
    };
    onSave(item);
    onClose();
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)]/95 px-4 py-3 backdrop-blur sm:px-5">
          <div>
            <h2 className="font-display text-lg font-bold">{editing ? 'Edit item' : 'Add to shelf'}</h2>
            <p className="text-xs text-[var(--text-muted)]">Name, SKU, barcode, or model — we guess the rest.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-[var(--bg-soft)]" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-4 sm:p-5">
          {duplicates.length > 0 && (
            <div className="flex gap-2 rounded-2xl border border-amber-400/50 bg-amber-400/10 p-3 text-sm">
              <AlertTriangle className="mt-0.5 shrink-0 text-amber-500" size={18} />
              <div className="text-left">
                <p className="font-bold text-amber-700 dark:text-amber-300">Possible duplicate</p>
                <ul className="mt-1 space-y-0.5 text-xs text-[var(--text-muted)]">
                  {duplicates.slice(0, 3).map((d) => (
                    <li key={d.id}>• {d.name}{d.sku ? ` (${d.sku})` : ''}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
            <div className="space-y-2">
              <div className="aspect-square overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]">
                <img src={preview} alt="" className="h-full w-full object-cover" style={{ background: placeholderGradient(draft.brand, draft.color) }} />
              </div>
              <div className="flex flex-wrap gap-1">
                {draft.images.map((img, i) => (
                  <div key={i} className="relative">
                    <button
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, primaryImageIndex: i }))}
                      className={`h-10 w-10 overflow-hidden rounded-lg border-2 ${i === draft.primaryImageIndex ? 'border-stud-red' : 'border-transparent'}`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                    <button type="button" onClick={() => removeImage(i)} className="absolute -right-1 -top-1 rounded-full bg-stud-red p-0.5 text-white" aria-label="Remove image">
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-left">
              <label className="block text-xs font-bold">
                Name *
                <input
                  required
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm"
                  placeholder="Hot Wheels Twin Mill Red"
                />
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <label className="block text-xs font-bold">
                  SKU
                  <input value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
                </label>
                <label className="block text-xs font-bold">
                  Barcode
                  <input value={draft.barcode} onChange={(e) => setDraft({ ...draft, barcode: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
                </label>
                <label className="block text-xs font-bold">
                  Model #
                  <input value={draft.modelNumber} onChange={(e) => setDraft({ ...draft, modelNumber: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <BrandBadge brand={draft.brand} size="md" />
                <span className="text-xs text-[var(--text-muted)]">Auto-detected — edit below anytime.</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-xs font-bold">
              Brand
              <select value={draft.brand} onChange={(e) => setDraft({ ...draft, brand: e.target.value as Brand })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm">
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <label className="block text-xs font-bold">
              Category
              <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block text-xs font-bold">
              Color
              <select value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value as ColorFamily })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm">
                {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-bold">
              Tags (comma-separated)
              <input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" placeholder="Die-cast, 1:64" />
            </label>
            <label className="block text-xs font-bold">
              Custom labels
              <input value={draft.customLabels} onChange={(e) => setDraft({ ...draft, customLabels: e.target.value })} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" placeholder="JDM, Display" />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="block text-xs font-bold">
              Image URL
              <div className="mt-1 flex gap-2">
                <input value={draft.imageUrl} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" placeholder="https://…" />
                <button type="button" onClick={addImageUrl} className="rounded-xl bg-sky-blue px-3 py-2 text-xs font-bold text-white">Add</button>
              </div>
            </label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3 text-xs font-bold hover:border-sky-blue">
              <ImagePlus size={18} />
              Upload
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
            </label>
          </div>

          <label className="block text-xs font-bold">
            Notes
            <textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} rows={2} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm" />
          </label>

          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <label className="inline-flex items-center gap-2 rounded-xl bg-[var(--bg-soft)] px-3 py-2">
              <input type="checkbox" checked={draft.starred} onChange={(e) => setDraft({ ...draft, starred: e.target.checked })} />
              <Star size={14} className="text-brick-yellow" /> Starred
            </label>
            <label className="inline-flex items-center gap-2 rounded-xl bg-[var(--bg-soft)] px-3 py-2">
              <input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
              <Sparkles size={14} className="text-stud-red" /> Featured
            </label>
            <label className="inline-flex items-center gap-2 rounded-xl bg-[var(--bg-soft)] px-3 py-2">
              <input type="checkbox" checked={draft.isWant} onChange={(e) => setDraft({ ...draft, isWant: e.target.checked })} />
              Want list
            </label>
            <label className="inline-flex items-center gap-2 text-xs">
              Acquired
              <input type="date" value={draft.acquiredAt} onChange={(e) => setDraft({ ...draft, acquiredAt: e.target.value })} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-2 py-1.5" />
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
            <button type="button" onClick={onClose} className="rounded-2xl px-4 py-2.5 text-sm font-bold hover:bg-[var(--bg-soft)]">Cancel</button>
            <button type="submit" className="rounded-2xl bg-stud-red px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-stud-red/30 hover:brightness-110">
              {editing ? 'Save changes' : 'Add to shelf'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
