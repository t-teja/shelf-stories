import type { ReactNode } from 'react';
import {
  Boxes,
  Car,
  Clapperboard,
  Gem,
  Grid3X3,
  Heart,
  LayoutGrid,
  Plane,
  Trophy,
  X,
} from 'lucide-react';
import type { Room } from '../types';
import { ROOMS } from '../types';

const ICONS: Record<Room, ReactNode> = {
  all: <LayoutGrid size={18} />,
  garage: <Car size={18} />,
  brickyard: <Boxes size={18} />,
  treasure: <Gem size={18} />,
  sky: <Plane size={18} />,
  paddock: <Trophy size={18} />,
  want: <Heart size={18} />,
  studmap: <Grid3X3 size={18} />,
  tv: <Clapperboard size={18} />,
};

export function Sidebar({
  room,
  onSelect,
  open,
  onClose,
  counts,
}: {
  room: Room;
  onSelect: (r: Room) => void;
  open: boolean;
  onClose: () => void;
  counts: Partial<Record<Room, number>>;
}) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)] p-4 transition-transform md:static md:z-0 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stud-red text-sm font-extrabold text-white shadow-lg shadow-stud-red/30 pulse-stud">
              SS
            </div>
            <div>
              <p className="font-display text-base font-bold leading-tight">Shelf Stories</p>
              <p className="text-[11px] text-[var(--text-muted)]">Toy museum shelves</p>
            </div>
          </div>
          <button type="button" className="rounded-lg p-2 md:hidden" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {ROOMS.map((r) => {
            const active = room === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  onSelect(r.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                  active
                    ? 'bg-stud-red text-white shadow-md shadow-stud-red/25'
                    : 'hover:bg-[var(--bg-soft)]'
                }`}
              >
                <span className={active ? 'text-white' : 'text-sky-blue'}>{ICONS[r.id]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{r.label}</span>
                  <span className={`block truncate text-[11px] ${active ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                    {r.hint}
                  </span>
                </span>
                {typeof counts[r.id] === 'number' && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? 'bg-white/20' : 'bg-[var(--bg-soft)]'}`}>
                    {counts[r.id]}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-4 rounded-2xl bg-[var(--bg-soft)] p-3 text-[11px] text-[var(--text-muted)]">
          <p className="font-bold text-[var(--text)]">Clay + cinema</p>
          Soft rounded cards by day. Dark TV mode by night.
        </div>
      </aside>
    </>
  );
}
