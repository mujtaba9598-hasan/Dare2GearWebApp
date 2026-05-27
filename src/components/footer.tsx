import Link from "next/link";
import { MountainIcon } from "./icons";

export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <MountainIcon className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                Dare<span className="text-brand-600">to</span>Gear
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Plan smarter trips across Pakistan. Tell us your budget and we work
              out the fuel, stays and food — then show you exactly how far you can go.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div>
              <h4 className="font-display font-semibold text-ink">Explore</h4>
              <ul className="mt-3 space-y-2 text-muted">
                <li><Link href="/planner" className="hover:text-brand-700">Trip planner</Link></li>
                <li><Link href="/#destinations" className="hover:text-brand-700">Destinations</Link></li>
                <li><Link href="/#how" className="hover:text-brand-700">How it works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-ink">Regions</h4>
              <ul className="mt-3 space-y-2 text-muted">
                <li>Gilgit-Baltistan</li>
                <li>Azad Kashmir</li>
                <li>KPK & Galyat</li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-ink">About</h4>
              <ul className="mt-3 space-y-2 text-muted">
                <li>Estimates only</li>
                <li>Drive safe</li>
                <li>Travel responsibly</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Dare to Gear. Built for Pakistan&apos;s explorers.</p>
          <p>Costs are estimates — always keep an emergency buffer on the road.</p>
        </div>
      </div>
    </footer>
  );
}
