"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SearchIcon, MapPinIcon, CloseIcon } from "./icons";

export type CitySearchItem = {
  id: string;
  name: string;
  province: string;
};

const MAX_RESULTS = 8;

/** Rank cities for a query: prefix matches first, then any substring match. */
function rankCities(cities: CitySearchItem[], query: string): CitySearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const prefix: CitySearchItem[] = [];
  const contains: CitySearchItem[] = [];
  for (const c of cities) {
    const name = c.name.toLowerCase();
    if (name.startsWith(q)) prefix.push(c);
    else if (name.includes(q)) contains.push(c);
  }
  const byName = (a: CitySearchItem, b: CitySearchItem) =>
    a.name.localeCompare(b.name);
  prefix.sort(byName);
  contains.sort(byName);
  return [...prefix, ...contains].slice(0, MAX_RESULTS);
}

/** Highlight the matched portion of a city name. */
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
 * Live city search with real-time autocomplete. As the user types, the list
 * filters down (prefix matches first) — type "S" for every city starting with
 * S, "Si" to narrow, "Sia" to narrow further. Picking a result opens that
 * city's page.
 */
export function CitySearch({ cities }: { cities: CitySearchItem[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => rankCities(cities, query), [cities, query]);
  const showPanel = open && query.trim().length > 0;

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

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          value={query}
          placeholder="Search a city — try typing “S”, “Si”, “Sia”…"
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // Delay so a click on a result still registers.
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={handleKeyDown}
          className="h-14 w-full rounded-2xl border border-line bg-surface pl-12 pr-11 text-base font-medium text-ink shadow-sm outline-none transition-colors placeholder:text-muted/80 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
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
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {showPanel && (
        <div
          id={listId}
          role="listbox"
          onMouseDown={() => {
            // Keep focus (and the panel) while clicking a result.
            if (blurTimer.current) clearTimeout(blurTimer.current);
          }}
          className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-slate-200/60"
        >
          {results.length === 0 ? (
            <p className="px-4 py-4 text-sm text-muted">
              No city matches “{query.trim()}”.
            </p>
          ) : (
            results.map((c, i) => (
              <Link
                key={c.id}
                ref={i === active ? activeLinkRef : undefined}
                href={`/cities/${c.id}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  i === active ? "bg-brand-50" : "hover:bg-canvas"
                }`}
              >
                <MapPinIcon className="h-4 w-4 shrink-0 text-brand-600" />
                <span className="font-medium text-ink">
                  <Highlight name={c.name} query={query} />
                </span>
                <span className="ml-auto text-xs text-muted">{c.province}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
