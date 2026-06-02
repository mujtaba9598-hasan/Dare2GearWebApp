"use client";

import { useState } from "react";
import Link from "next/link";
import { RENTAL_CATEGORIES, SERVICES } from "@/lib/catalog";
import { SiteSearch } from "./city-search";
import {
  ArrowRightIcon,
  BedIcon,
  ChevronDownIcon,
  MenuIcon,
  CloseIcon,
} from "./icons";

type NavLink = { label: string; href: string; tag?: string };
type NavHeading = { heading: string };
type NavItem = NavLink | NavHeading;
type NavMenu = { label: string; items: NavItem[] };

const isHeading = (item: NavItem): item is NavHeading => "heading" in item;

const EXPLORE: NavMenu = {
  label: "Explore",
  items: [
    { label: "All destinations", href: "/destinations" },
    { label: "Starting cities", href: "/cities" },
    { heading: "Top 10 places to see" },
    { label: "Hunza Valley", href: "/destinations/hunza", tag: "GB" },
    { label: "Skardu", href: "/destinations/skardu", tag: "GB" },
    { label: "Fairy Meadows", href: "/destinations/fairymeadows", tag: "GB" },
    { label: "Neelum Valley", href: "/destinations/neelum", tag: "AJK" },
    { label: "Swat Valley", href: "/destinations/swat", tag: "KPK" },
    { label: "Naran Kaghan", href: "/destinations/naran", tag: "KPK" },
    { label: "Deosai Plains", href: "/destinations/deosai", tag: "GB" },
    { label: "Khunjerab Pass", href: "/destinations/khunjerab", tag: "GB" },
    { label: "Naltar Valley", href: "/destinations/naltar", tag: "GB" },
    { label: "Shigar Valley", href: "/destinations/shigar", tag: "GB" },
  ],
};

const RENTALS: NavMenu = {
  label: "Rentals & Gear",
  items: [
    { label: "Overview", href: "/rentals" },
    ...RENTAL_CATEGORIES.map((c) => ({ label: c.navLabel, href: `/rentals/${c.slug}` })),
  ],
};

const SERVICES_MENU: NavMenu = {
  label: "Services",
  items: [
    { label: "Overview", href: "/services" },
    ...SERVICES.map((s) => ({ label: s.navLabel, href: `/services/${s.slug}` })),
  ],
};

const PLAN: NavMenu = {
  label: "Plan",
  items: [
    { label: "Budget planner — where can I go?", href: "/planner" },
    { label: "Specific trip — any place → any place", href: "/trip" },
  ],
};

const MENUS: NavMenu[] = [EXPLORE, PLAN, RENTALS, SERVICES_MENU];

function DesktopDropdown({ menu }: { menu: NavMenu }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 py-2 text-sm font-medium text-muted transition-colors group-hover:text-ink"
      >
        {menu.label}
        <ChevronDownIcon className="h-4 w-4 transition-transform group-hover:rotate-180" />
      </button>
      {/* pt-2 keeps the panel touching the button so hover doesn't drop */}
      <div className="invisible absolute left-1/2 top-full z-40 -translate-x-1/2 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="w-56 rounded-2xl border border-line bg-surface p-2 shadow-xl shadow-slate-200/60">
          {menu.items.map((item) =>
            isHeading(item) ? (
              <p
                key={item.heading}
                className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wider text-brand-600"
              >
                {item.heading}
              </p>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-canvas hover:text-brand-700"
              >
                {item.label}
                {item.tag && (
                  <span className="text-xs font-semibold text-muted">{item.tag}</span>
                )}
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center" aria-label="Dare2Gear — Pakistan Adventure Planner home">
          <img
            src="/logo.png"
            alt="Dare2Gear — Pakistan Adventure Planner"
            width={639}
            height={640}
            className="h-14 w-auto sm:h-16 transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Desktop menus */}
        <div className="hidden items-center gap-6 lg:flex">
          {MENUS.map((m) => (
            <DesktopDropdown key={m.label} menu={m} />
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global search — desktop */}
          <div className="hidden lg:block lg:w-48 xl:w-60">
            <SiteSearch variant="compact" />
          </div>

          <Link
            href="/list-your-property"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm font-semibold text-amber-700 shadow-sm transition-colors hover:bg-amber-100 sm:px-4"
          >
            <BedIcon className="h-4 w-4" />
            <span className="sm:hidden">List property</span>
            <span className="hidden sm:inline">List your property</span>
          </Link>
          <Link
            href="/planner"
            className="hidden cursor-pointer items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 lg:inline-flex"
          >
            Plan a trip
            <ArrowRightIcon className="h-4 w-4" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-line bg-surface lg:hidden">
          <div className="mx-auto max-w-7xl space-y-5 px-5 py-5 sm:px-8">
            {/* Global search — mobile */}
            <SiteSearch variant="compact" onNavigate={() => setOpen(false)} />
            {MENUS.map((m) => (
              <div key={m.label}>
                <p className="font-display text-sm font-bold text-ink">{m.label}</p>
                <div className="mt-2 grid gap-1">
                  {m.items.map((item) =>
                    isHeading(item) ? (
                      <p
                        key={item.heading}
                        className="px-3 pb-0.5 pt-2 text-xs font-bold uppercase tracking-wider text-brand-600"
                      >
                        {item.heading}
                      </p>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-canvas hover:text-brand-700"
                      >
                        {item.label}
                        {item.tag && (
                          <span className="text-xs font-semibold text-muted/80">
                            {item.tag}
                          </span>
                        )}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}
            <div className="grid gap-2 border-t border-line pt-4">
              <Link
                href="/planner"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white"
              >
                Plan a trip
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
