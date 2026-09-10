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
        hint="Star or feature a few pieces, then return for a cinematic presentation."
        action={
          <button type="button" onClick={onExit} className="btn-primary">
            Back to collection
          </button>
        }
      />
    );
  }

  const current = slides[Math.min(index, slides.length - 1)];
  const cover = current.images[current.primaryImageIndex] ?? current.images[0];

  return (
    <div id="tv-stage" className="relative overflow-hidden border border-[var(--border)] bg-black text-white animate-in">
      <div className="relative aspect-video min-h-[50vh] w-full overflow-hidden bg-[#000] sm:min-h-[60vh]">
        {cover && (
          <img
            key={current.id + String(index)}
            src={cover}
            alt={current.name}
            className="ken-burns absolute inset-0 h-full w-full object-cover opacity-90"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />

        <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2 sm:left-8 sm:top-8">
          <span className="border-b border-[#DA291C] pb-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white">
            Showcase
          </span>
          <BrandBadge brand={current.brand} size="md" />
          {current.featured && (
            <span className="inline-flex items-center gap-1 border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-white/90">
              <Sparkles size={10} /> Featured
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="rule-rosso mb-4" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 sm:text-[11px]">
            {current.category} · {current.color}
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium leading-tight tracking-wide sm:text-5xl md:text-6xl">
            {current.name}
          </h2>
          {(current.sku || current.modelNumber) && (
            <p className="mt-3 font-mono text-xs tracking-wider text-white/50">{current.sku || current.modelNumber}</p>
          )}
          {current.notes && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">{current.notes}</p>}
          <p className="mt-6 text-[10px] uppercase tracking-[0.15em] text-white/35">
            {index + 1} / {slides.length} · Space pause · ← → navigate · F fullscreen · Esc exit
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 bg-[#111] px-3 py-3 sm:px-5">
        <button type="button" onClick={prev} className="border border-white/15 p-2 hover:border-white/40" aria-label="Previous">
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <button type="button" onClick={() => setPaused((p) => !p)} className="border border-white/15 p-2 hover:border-white/40" aria-label={paused ? 'Play' : 'Pause'}>
          {paused ? <Play size={16} strokeWidth={1.5} /> : <Pause size={16} strokeWidth={1.5} />}
        </button>
        <button type="button" onClick={next} className="border border-white/15 p-2 hover:border-white/40" aria-label="Next">
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
        <button type="button" onClick={toggleFullscreen} className="border border-white/15 p-2 hover:border-white/40" aria-label="Fullscreen">
          {isFullscreen ? <Minimize size={16} strokeWidth={1.5} /> : <Maximize size={16} strokeWidth={1.5} />}
        </button>
        <label className="ml-2 inline-flex items-center gap-2 border border-white/10 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-white/70">
          <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="accent-[#DA291C]" />
          Featured playlist
        </label>
        <button type="button" onClick={onExit} className="btn-primary ml-auto !py-2 !text-[10px]">
          <X size={12} /> Exit
        </button>
      </div>
    </div>
  );
}
