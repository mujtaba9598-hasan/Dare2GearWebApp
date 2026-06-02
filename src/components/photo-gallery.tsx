"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/photos";
import { resolveSpot, type SpotContext } from "@/lib/spots";
import { SpotDetailModal } from "./spot-detail-modal";
import { CloseIcon, ArrowLeftIcon, ArrowRightIcon } from "./icons";

function ZoomInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function ZoomOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const STEP = 0.5;

export function PhotoGallery({
  photos,
  altPrefix,
  parentId,
  parentKind,
}: {
  photos: Photo[];
  altPrefix: string;
  /** When set, captions become clickable and open a per-spot detail. */
  parentId?: string;
  parentKind?: "destination" | "city";
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [spot, setSpot] = useState<SpotContext | null>(null);
  const spotsEnabled = Boolean(parentId && parentKind);

  const openSpot = useCallback(
    (caption: string) => {
      if (!parentId || !parentKind) return;
      setSpot(resolveSpot(parentId, parentKind, caption));
    },
    [parentId, parentKind],
  );
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    reset();
  }, [reset]);

  const go = useCallback(
    (dir: number) => {
      setOpen((cur) => {
        if (cur === null) return cur;
        const next = (cur + dir + photos.length) % photos.length;
        return next;
      });
      reset();
    },
    [photos.length, reset],
  );

  const zoom = useCallback((delta: number) => {
    setScale((s) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, +(s + delta).toFixed(2)));
      if (next === MIN_SCALE) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Keyboard controls + lock body scroll while open.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") zoom(STEP);
      else if (e.key === "-") zoom(-STEP);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, go, zoom]);

  if (photos.length === 0) return null;

  const current = open === null ? null : photos[open];

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {photos.map((p, i) => (
          <figure
            key={p.src}
            className="group overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(i);
                reset();
              }}
              aria-label={p.caption ? `Zoom ${p.caption}` : `Zoom photo ${i + 1}`}
              className="block w-full cursor-zoom-in overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.caption || `${altPrefix} photo ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </button>
            {p.caption &&
              (spotsEnabled ? (
                <button
                  type="button"
                  onClick={() => openSpot(p.caption)}
                  className="flex w-full items-center justify-center gap-1.5 bg-ink px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  aria-label={`See details & vehicle guide for ${p.caption}`}
                >
                  {p.caption}
                  <ArrowRightIcon className="h-3.5 w-3.5 opacity-70" />
                </button>
              ) : (
                <figcaption className="bg-ink px-3 py-2 text-center text-sm font-semibold text-white">
                  {p.caption}
                </figcaption>
              ))}
          </figure>
        ))}
      </div>

      {/* Per-spot detail modal (opened from a caption) */}
      <SpotDetailModal spot={spot} onClose={() => setSpot(null)} />

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/92 backdrop-blur-sm"
          onClick={close}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between gap-2 px-4 py-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-medium text-white/70">
              {open! + 1} / {photos.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => zoom(-STEP)}
                disabled={scale <= MIN_SCALE}
                aria-label="Zoom out"
                className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-white/20 disabled:opacity-30"
              >
                <ZoomOutIcon className="h-5 w-5" />
              </button>
              <span className="w-12 text-center text-sm tabular-nums text-white/80">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => zoom(STEP)}
                disabled={scale >= MAX_SCALE}
                aria-label="Zoom in"
                className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-white/20 disabled:opacity-30"
              >
                <ZoomInIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="ml-2 rounded-full bg-white/10 p-2.5 transition-colors hover:bg-white/20"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Image stage */}
          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden px-2"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => zoom(e.deltaY < 0 ? STEP : -STEP)}
          >
            {photos.length > 1 && (
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous"
                className="absolute left-3 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.caption || altPrefix}
              draggable={false}
              onClick={() => (scale > 1 ? reset() : zoom(1.5))}
              onPointerDown={(e) => {
                if (scale <= 1) return;
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
                drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
              }}
              onPointerMove={(e) => {
                if (!drag.current) return;
                setOffset({
                  x: drag.current.ox + (e.clientX - drag.current.x),
                  y: drag.current.oy + (e.clientY - drag.current.y),
                });
              }}
              onPointerUp={() => (drag.current = null)}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                cursor: scale > 1 ? "grab" : "zoom-in",
                transition: drag.current ? "none" : "transform 0.2s ease-out",
              }}
              className="max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl"
            />

            {photos.length > 1 && (
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next"
                className="absolute right-3 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              >
                <ArrowRightIcon className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Caption */}
          {current.caption && (
            <div
              className="px-4 py-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {spotsEnabled ? (
                <button
                  type="button"
                  onClick={() => {
                    const cap = current.caption;
                    close();
                    openSpot(cap);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-50"
                >
                  {current.caption} — details &amp; vehicle guide
                  <ArrowRightIcon className="h-3.5 w-3.5 text-brand-600" />
                </button>
              ) : (
                <p className="inline-block rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white">
                  {current.caption}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
