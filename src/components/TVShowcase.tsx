import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize, Pause, Play, Sparkles, X } from 'lucide-react';
import type { CollectionItem } from '../types';
import { BrandBadge } from './BrandBadge';
import { EmptyState } from './EmptyState';

export function TVShowcase({
  items,
  onExit,
}: {
  items: CollectionItem[];
  onExit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const playlist = featuredOnly
    ? items.filter((i) => i.featured || i.starred)
    : items;
  const slides = playlist.length > 0 ? playlist : items;

  const next = useCallback(() => {
    if (slides.length === 0) return;
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    setIndex(0);
  }, [featuredOnly, slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, next, slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      else if (e.key === 'Escape') {
        if (document.fullscreenElement) document.exitFullscreen();
        else onExit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onExit]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFullscreen = () => {
    const el = document.getElementById('tv-stage');
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="Showcase is empty"
        hint="Star or feature a few items, then return for a cinema-ready slideshow."
        action={
          <button type="button" onClick={onExit} className="rounded-2xl bg-stud-red px-4 py-2 text-sm font-bold text-white">
            Back to library
          </button>
        }
      />
    );
  }

  const current = slides[Math.min(index, slides.length - 1)];
  const cover = current.images[current.primaryImageIndex] ?? current.images[0];

  return (
    <div id="tv-stage" className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-black text-white shadow-2xl animate-in">
      <div className="relative aspect-video min-h-[50vh] w-full overflow-hidden bg-[#0a0a0c] sm:min-h-[60vh]">
        {cover && (
          <img
            key={current.id + String(index)}
            src={cover}
            alt={current.name}
            className="ken-burns absolute inset-0 h-full w-full object-cover opacity-90"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />

        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2 sm:left-6 sm:top-6">
          <span className="rounded-full bg-stud-red px-3 py-1 text-xs font-extrabold tracking-wide">TV SHOWCASE</span>
          <BrandBadge brand={current.brand} size="md" />
          {current.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brick-yellow px-2.5 py-1 text-xs font-bold text-ink">
              <Sparkles size={12} /> Featured
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60 sm:text-sm">{current.category} · {current.color}</p>
          <h2 className="mt-1 font-display text-2xl font-bold leading-tight sm:text-4xl md:text-5xl">{current.name}</h2>
          {(current.sku || current.modelNumber) && (
            <p className="mt-2 font-mono text-sm text-white/70">{current.sku || current.modelNumber}</p>
          )}
          {current.notes && <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">{current.notes}</p>}
          <p className="mt-4 text-xs text-white/50">
            {index + 1} / {slides.length} · Space pause · ← → navigate · F fullscreen · Esc exit
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-[#12131a] px-3 py-3 sm:px-4">
        <button type="button" onClick={prev} className="rounded-xl bg-white/10 p-2 hover:bg-white/20" aria-label="Previous">
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={() => setPaused((p) => !p)} className="rounded-xl bg-white/10 p-2 hover:bg-white/20" aria-label={paused ? 'Play' : 'Pause'}>
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
        <button type="button" onClick={next} className="rounded-xl bg-white/10 p-2 hover:bg-white/20" aria-label="Next">
          <ChevronRight size={18} />
        </button>
        <button type="button" onClick={toggleFullscreen} className="rounded-xl bg-white/10 p-2 hover:bg-white/20" aria-label="Fullscreen">
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
        <label className="ml-2 inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold">
          <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} />
          Featured / starred playlist
        </label>
        <button type="button" onClick={onExit} className="ml-auto inline-flex items-center gap-1 rounded-xl bg-stud-red px-3 py-2 text-xs font-bold">
          <X size={14} /> Exit
        </button>
      </div>
    </div>
  );
}
