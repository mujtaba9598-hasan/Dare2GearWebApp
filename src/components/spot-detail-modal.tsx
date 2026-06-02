"use client";

import { useEffect } from "react";
import type { SpotContext } from "@/lib/spots";
import { BikerPracticality } from "./biker-practicality";
import { MapPinIcon, CloseIcon } from "./icons";

/**
 * A focused, page-like overlay for a single spot (e.g. "Basho Valley") opened
 * by clicking its photo caption. Shows the spot's own blurb and a vehicle
 * recommendation computed for THAT spot specifically (not the whole region).
 */
export function SpotDetailModal({
  spot,
  onClose,
}: {
  spot: SpotContext | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!spot) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [spot, onClose]);

  if (!spot) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="my-4 w-full max-w-3xl rounded-2xl border border-line bg-canvas shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 rounded-t-2xl border-b border-line bg-surface px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
              {spot.name}
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
              <MapPinIcon className="h-4 w-4 text-brand-600" />
              {spot.parentKind === "destination" ? "Part of" : "In"}{" "}
              <span className="font-semibold text-ink">{spot.parentName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full border border-line bg-surface p-2 text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-6 sm:px-6">
          {spot.blurb && (
            <p className="mt-4 text-sm leading-relaxed text-muted">{spot.blurb}</p>
          )}

          {/* Vehicle recommendation + practicality, scoped to THIS spot. The
              section already renders its own heading & signals. */}
          <div className="-mt-4">
            <BikerPracticality destination={spot.dest} />
          </div>
        </div>
      </div>
    </div>
  );
}
