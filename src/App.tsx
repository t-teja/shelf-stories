import { useCallback, useMemo, useRef, useState } from 'react';
import { Download, Menu, Moon, Plus, Sun, Upload } from 'lucide-react';
import { useCollection } from './hooks/useCollection';
import { useTheme } from './hooks/useTheme';
import { Sidebar } from './components/Sidebar';
import { FiltersBar } from './components/FiltersBar';
import { ItemCard } from './components/ItemCard';
import { ItemListRow } from './components/ItemListRow';
import { AddItemModal } from './components/AddItemModal';
import { StudMap } from './components/StudMap';
import { TVShowcase } from './components/TVShowcase';
import { EmptyState } from './components/EmptyState';
import { exportToJson, parseImportFile } from './lib/exportImport';
import type { CollectionItem, Room } from './types';
import { ROOMS } from './types';

export default function App() {
  const { theme, toggle } = useTheme();
  const {
    items,
    visible,
    showcaseItems,
    loading,
    room,
    setRoom,
    filters,
    setFilters,
    sort,
    setSort,
    viewMode,
    setViewMode,
    upsert,
    remove,
    replaceAll,
    findDuplicates,
    allTags,
  } = useCollection();

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CollectionItem | null>(null);
  const [initialWant, setInitialWant] = useState(false);
  const [draftForDup, setDraftForDup] = useState({ name: '', sku: '', barcode: '', modelNumber: '' });
  const importRef = useRef<HTMLInputElement>(null);

  const roomMeta = ROOMS.find((r) => r.id === room)!;

  const counts = useMemo(() => {
    const c: Partial<Record<Room, number>> = {};
    const owned = items.filter((i) => !i.isWant);
    c.all = owned.length;
    c.garage = owned.filter((i) => i.brand === 'Hot Wheels' || i.brand === 'Matchbox' || i.category === 'Cars').length;
    c.brickyard = owned.filter((i) => i.brand === 'Lego' || i.category === 'Technic' || i.category === 'Sets').length;
    c.treasure = owned.filter((i) => i.category === 'Premium' || i.starred || i.featured).length;
    c.sky = owned.filter((i) => i.category === 'Flights').length;
    c.paddock = owned.filter((i) => i.category === 'F1').length;
    c.want = items.filter((i) => i.isWant).length;
    c.studmap = owned.length;
    c.tv = showcaseItems.length;
    return c;
  }, [items, showcaseItems]);

  const duplicates = useMemo(
    () => findDuplicates(draftForDup, editing?.id),
    [draftForDup, editing, findDuplicates]
  );

  const onDraftChange = useCallback((d: { name: string; sku: string; barcode: string; modelNumber: string }) => {
    setDraftForDup(d);
  }, []);

  const openAdd = (want = false) => {
    setEditing(null);
    setInitialWant(want || room === 'want');
    setDraftForDup({ name: '', sku: '', barcode: '', modelNumber: '' });
    setModalOpen(true);
  };

  const openEdit = (item: CollectionItem) => {
    setEditing(item);
    setInitialWant(false);
    setDraftForDup({
      name: item.name,
      sku: item.sku ?? '',
      barcode: item.barcode ?? '',
      modelNumber: item.modelNumber ?? '',
    });
    setModalOpen(true);
  };

  const onSave = async (item: CollectionItem) => {
    await upsert(item);
  };

  const onToggleStar = async (item: CollectionItem) => {
    await upsert({ ...item, starred: !item.starred, updatedAt: new Date().toISOString() });
  };

  const onDelete = async (item: CollectionItem) => {
    if (confirm(`Remove "${item.name}" from the shelf?`)) {
      await remove(item.id);
    }
  };

  const onImport = async (file: File | null) => {
    if (!file) return;
    try {
      const imported = await parseImportFile(file);
      const mode = confirm(
        `Import ${imported.length} items?\n\nOK = Merge with current collection\nCancel = Choose replace…`
      );
      if (mode) {
        const map = new Map(items.map((i) => [i.id, i]));
        imported.forEach((i) => map.set(i.id, i));
        await replaceAll(Array.from(map.values()));
        return;
      }
      const doReplace = confirm('Replace the entire collection with this file? This cannot be undone.');
      if (doReplace) await replaceAll(imported);
    } catch (err) {
      alert(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="stud-bg flex min-h-svh">
      <Sidebar
        room={room}
        onSelect={setRoom}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        counts={counts}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg)]/90 px-3 py-3 backdrop-blur sm:px-5">
          <button type="button" className="rounded-xl p-2 hover:bg-[var(--bg-soft)] md:hidden" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu size={20} />
          </button>
          <div className="min-w-0 flex-1 text-left">
            <h1 className="truncate font-display text-lg font-bold sm:text-xl">{roomMeta.label}</h1>
            <p className="truncate text-xs text-[var(--text-muted)]">{roomMeta.hint}</p>
          </div>
          <button type="button" onClick={toggle} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2" aria-label="Toggle theme" title={theme === 'light' ? 'Dark cinema' : 'Light clay'}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button type="button" onClick={() => exportToJson(items)} className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2" title="Export JSON" aria-label="Export">
            <Download size={18} />
          </button>
          <button type="button" onClick={() => importRef.current?.click()} className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2" title="Import JSON" aria-label="Import">
            <Upload size={18} />
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              void onImport(e.target.files?.[0] ?? null);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => openAdd(room === 'want')}
            className="inline-flex items-center gap-1 rounded-2xl bg-stud-red px-3 py-2 text-sm font-bold text-white shadow-lg shadow-stud-red/25 hover:brightness-110"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </header>

        <main className="flex-1 px-3 py-4 sm:px-5 sm:py-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center text-[var(--text-muted)]">Opening the museum…</div>
          ) : room === 'tv' ? (
            <TVShowcase items={showcaseItems} onExit={() => setRoom('all')} />
          ) : room === 'studmap' ? (
            <StudMap items={visible} onSelect={openEdit} />
          ) : (
            <div className="space-y-4">
              <FiltersBar
                filters={filters}
                onChange={setFilters}
                sort={sort}
                onSort={setSort}
                viewMode={viewMode}
                onViewMode={setViewMode}
                allTags={allTags}
              />

              {visible.length === 0 ? (
                <EmptyState
                  title={room === 'want' ? 'Want list is clear' : 'This room is empty'}
                  hint={
                    room === 'want'
                      ? 'Add dream cars, sets, and chase pieces you are still hunting.'
                      : 'Add your first Hot Wheels, Lego, or Matchbox piece to bring this room to life.'
                  }
                  action={
                    <button
                      type="button"
                      onClick={() => openAdd(room === 'want')}
                      className="rounded-2xl bg-stud-red px-4 py-2.5 text-sm font-bold text-white"
                    >
                      {room === 'want' ? 'Add a want' : 'Add an item'}
                    </button>
                  }
                />
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {visible.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onEdit={openEdit}
                      onToggleStar={onToggleStar}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {visible.map((item) => (
                    <ItemListRow
                      key={item.id}
                      item={item}
                      onEdit={openEdit}
                      onToggleStar={onToggleStar}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )}

              <p className="pt-2 text-center text-xs text-[var(--text-muted)]">
                Showing {visible.length} · {items.filter((i) => !i.isWant).length} owned · {items.filter((i) => i.isWant).length} wants
              </p>
            </div>
          )}
        </main>
      </div>

      <AddItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={onSave}
        editing={editing}
        duplicates={duplicates}
        initialWant={initialWant}
        onDraftChange={onDraftChange}
      />
    </div>
  );
}
