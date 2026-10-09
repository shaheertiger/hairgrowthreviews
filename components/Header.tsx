import Link from "next/link";
import { site } from "@/lib/site";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-brand-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white">
            H
          </span>
          {site.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-stone-700 md:flex">
          {site.navCategories.map((cat) => (
            <div key={cat.label} className="group relative">
              <Link href={cat.href} className="flex items-center gap-1 py-2 hover:text-brand-700">
                {cat.label}
                {cat.children && (
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mt-0.5">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </Link>
              {cat.children && (
                <div className="invisible absolute left-0 top-full min-w-[220px] rounded-lg border border-border-subtle bg-surface py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                  {cat.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm font-medium text-stone-700 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link
            href="/best"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
          >
            <span className="sm:hidden">Top Picks</span>
            <span className="hidden sm:inline">See Top Picks</span>
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
