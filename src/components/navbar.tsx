import Link from "next/link";
import { MountainIcon, ArrowRightIcon } from "./icons";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm transition-colors group-hover:bg-brand-700">
            <MountainIcon className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Dare<span className="text-brand-600">to</span>Gear
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <Link href="/#how" className="transition-colors hover:text-ink">
            How it works
          </Link>
          <Link href="/#destinations" className="transition-colors hover:text-ink">
            Destinations
          </Link>
          <Link href="/planner" className="transition-colors hover:text-ink">
            Planner
          </Link>
        </div>

        <Link
          href="/planner"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Plan a trip
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </nav>
    </header>
  );
}
