"use client";

import { useState } from "react";
import Link from "next/link";
import { RENTAL_CATEGORIES, SERVICES } from "@/lib/catalog";
import {
  MountainIcon,
  ArrowRightIcon,
  BedIcon,
  ChevronDownIcon,
  MenuIcon,
  CloseIcon,
} from "./icons";

type NavItem = { label: string; href: string };
type NavMenu = { label: string; items: NavItem[] };

const EXPLORE: NavMenu = {
  label: "Explore",
  items: [
    { label: "All destinations", href: "/destinations" },
    { label: "Starting cities", href: "/cities" },
    { label: "Hunza", href: "/destinations/hunza" },
    { label: "Skardu", href: "/destinations/skardu" },
    { label: "Swat & Kalam", href: "/destinations/swat" },
    { label: "Fairy Meadows", href: "/destinations/fairymeadows" },
    // Azad Kashmir city pages
    { label: "Muzaffarabad (AJK)", href: "/cities/muzaffarabad" },
    { label: "Mirpur (AJK)", href: "/cities/mirpurajk" },
    { label: "Bagh (AJK)", href: "/cities/bagh" },
    { label: "Kotli (AJK)", href: "/cities/kotli" },
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
          {menu.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-canvas hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm transition-colors group-hover:bg-brand-700">
            <MountainIcon className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Dare<span className="text-brand-600">2</span>Gear
          </span>
        </Link>

        {/* Desktop menus */}
        <div className="hidden items-center gap-7 lg:flex">
          {MENUS.map((m) => (
            <DesktopDropdown key={m.label} menu={m} />
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
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
            {MENUS.map((m) => (
              <div key={m.label}>
                <p className="font-display text-sm font-bold text-ink">{m.label}</p>
                <div className="mt-2 grid gap-1">
                  {m.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-canvas hover:text-brand-700"
                    >
                      {item.label}
                    </Link>
                  ))}
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
