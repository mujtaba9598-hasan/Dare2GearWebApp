"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { searchItems, type SearchItem } from "@/lib/search-index";
import { SearchIcon, MapPinIcon, CompassIcon, CloseIcon } from "./icons";

const MAX_RESULTS = 8;

/** Rank items for a query: prefix matches first, then any substring match. */
function rankItems(items: SearchItem[], query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const prefix: SearchItem[] = [];
  const contains: SearchItem[] = [];
  for (const it of items) {
    const name = it.name.toLowerCase();
    if (name.startsWith(q)) prefix.push(it);
    else if (name.includes(q)) contains.push(it);
  }
  const byName = (a: SearchItem, b: SearchItem) => a.name.localeCompare(b.name);
  prefix.sort(byName);
  contains.sort(byName);
  return [...prefix, ...contains].slice(0, MAX_RESULTS);
}

/** Highlight the matched portion of a name. */
function Highlight({ name, query }: { name: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{name}</>;
  const idx = name.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return <>{name}</>;
  return (
    <>
      {name.slice(0, idx)}
      <mark className="bg-transparent font-bold text-brand-700">
        {name.slice(idx, idx + q.length)}
      </mark>
      {name.slice(idx + q.length)}
    </>
  );
}

/**
 * Live site search with real-time autocomplete across every city AND
 * destination. As the user types, the list filters down (prefix matches
 * first) — type "S" for everything starting with S, "Si" to narrow, "Sia"
 * to narrow further. Picking a result opens that page.
 *
 * `variant="compact"` renders a smaller box for the nav bar.
 */
export function SiteSearch({
  variant = "hero",
  onNavigate,
}: {
  variant?: "hero" | "compact";
  /** Called when a result is chosen (e.g. to close a mobile drawer). */
  onNavigate?: () => void;
}) {
  const items = useMemo(() => searchItems(), []);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => rankItems(items, query), [items, query]);
  const showPanel = open && query.trim().length > 0;
  const compact = variant === "compact";

  // Close the panel on a click outside — robustly, without a blur timer that
  // could otherwise swallow a click on a result before it navigates.
  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDocDown);
    return () => document.removeEventListener("pointerdown", onDocDown);
  }, [open]);

  const handleChange = (value: string) => {
    setQuery(value);
    setActive(0);
    setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showPanel || results.length === 0) {
      if (e.key === "Escape") setQuery("");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      activeLinkRef.current?.click();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setQuery("");
      setOpen(false);
    }
  };

  const choose = () => {
    setQuery("");
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={rootRef} className={`relative w-full ${compact ? "" : "max-w-xl"}`}>
      <div className="relative">
        <SearchIcon
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted ${
            compact ? "left-3 h-4 w-4" : "left-4 h-5 w-5"
          }`}
        />
        <input
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Search cities and destinations"
          autoComplete="off"
          spellCheck={false}
          value={query}
          placeholder={
            compact ? "Search a place…" : "Search any city or destination — try “S”, “Si”, “Sia”…"
          }
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-xl border border-line bg-surface text-ink outline-none transition-colors placeholder:text-muted/80 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 ${
            compact
              ? "h-10 pl-9 pr-9 text-sm font-medium"
              : "h-14 rounded-2xl pl-12 pr-11 text-base font-medium shadow-sm"
          }`}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery("");
              setOpen(true);
            }}
            className={`absolute top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink ${
              compact ? "right-2 h-7 w-7" : "right-3 h-8 w-8"
            }`}
          >
            <CloseIcon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </button>
        )}
      </div>

      {showPanel && (
        <div
          id={listId}
          role="listbox"
          className={`absolute top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-slate-200/60 ${
            compact ? "right-0 w-80 max-w-[85vw]" : "left-0 right-0"
          }`}
        >
          {results.length === 0 ? (
            <p className="px-4 py-4 text-sm text-muted">No place matches “{query.trim()}”.</p>
          ) : (
            results.map((it, i) => (
              <Link
                key={it.key}
                ref={i === active ? activeLinkRef : undefined}
                href={it.href}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={choose}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  i === active ? "bg-brand-50" : "hover:bg-canvas"
                }`}
              >
                {it.kind === "City" ? (
                  <MapPinIcon className="h-4 w-4 shrink-0 text-brand-600" />
                ) : it.kind === "Destination" ? (
                  <CompassIcon className="h-4 w-4 shrink-0 text-amber-600" />
                ) : (
                  <MapPinIcon className="h-4 w-4 shrink-0 text-slate-400" />
                )}
                <span className="min-w-0 truncate font-medium text-ink">
                  <Highlight name={it.name} query={query} />
                </span>
                <span className="ml-auto flex shrink-0 items-center gap-2 text-xs text-muted">
                  <span className="hidden max-w-[10rem] truncate sm:inline">{it.sub}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      it.kind === "City"
                        ? "bg-brand-50 text-brand-700"
                        : it.kind === "Destination"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {it.tag}
                  </span>
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
