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
  all: <LayoutGrid size={16} strokeWidth={1.5} />,
  garage: <Car size={16} strokeWidth={1.5} />,
  brickyard: <Boxes size={16} strokeWidth={1.5} />,
  treasure: <Gem size={16} strokeWidth={1.5} />,
  sky: <Plane size={16} strokeWidth={1.5} />,
  paddock: <Trophy size={16} strokeWidth={1.5} />,
  want: <Heart size={16} strokeWidth={1.5} />,
  studmap: <Grid3X3 size={16} strokeWidth={1.5} />,
  tv: <Clapperboard size={16} strokeWidth={1.5} />,
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
        <div className="fixed inset-0 z-40 bg-black/70 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border)] bg-[#000] p-5 transition-transform md:static md:z-0 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border border-[#DA291C] text-[10px] font-semibold tracking-[0.15em] text-white">
              SS
            </div>
            <div>
              <p className="font-display text-lg font-medium leading-tight tracking-wide text-white">Shelf Stories</p>
              <p className="label-caps mt-0.5 text-[#8F8F8F]">Private Collection</p>
            </div>
          </div>
          <button type="button" className="p-2 text-[#8F8F8F] hover:text-white md:hidden" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto">
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
                className={`group flex w-full items-center gap-3 border-l-2 px-3 py-2.5 text-left transition ${
                  active
                    ? 'border-[#DA291C] bg-white/[0.04] text-white'
                    : 'border-transparent text-[#8F8F8F] hover:border-[#2A2A2A] hover:text-white'
                }`}
              >
                <span className={active ? 'text-[#DA291C]' : 'text-[#8F8F8F] group-hover:text-white'}>{ICONS[r.id]}</span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[11px] font-medium uppercase tracking-[0.12em] ${active ? 'text-white' : ''}`}>
                    {r.label}
                  </span>
                </span>
                {typeof counts[r.id] === 'number' && (
                  <span className={`text-[10px] tracking-wider ${active ? 'text-[#DA291C]' : 'text-[#6B6B6B]'}`}>
                    {counts[r.id]}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-[#2A2A2A] pt-4">
          <div className="rule-rosso mb-3" />
          <p className="label-caps text-[#8F8F8F]">Curated inventory</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#6B6B6B]">
            Dark cinema by default. Rosso accents reserved for action.
          </p>
        </div>
      </aside>
    </>
  );
}
