"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { site } from "@/lib/site";

/** Hamburger menu for small screens, where the desktop dropdown nav is hidden. */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-stone-800 hover:bg-brand-50"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open &&
        createPortal(
        <nav onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)} className="fixed inset-x-0 bottom-0 top-[61px] z-50 overflow-y-auto bg-surface px-4 pb-10 pt-4">
          <Link
            href="/best"
            className="mb-4 block rounded-xl bg-accent-500 px-4 py-3.5 text-center text-sm font-black uppercase tracking-wide text-white"
          >
            See All Best Picks
          </Link>
          {site.navCategories.map((cat) => (
            <div key={cat.label} className="border-b border-border-subtle py-3">
              <Link href={cat.href} className="block py-1.5 text-base font-bold text-stone-900">
                {cat.label}
              </Link>
              {cat.children && (
                <ul className="mt-1 grid grid-cols-1 gap-0.5 pl-3">
                  {cat.children.map((child) => (
                    <li key={child.label}>
                      <Link href={child.href} className="block py-2 text-sm font-medium text-stone-600">
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>,
          // Portalled to <body>: the header's backdrop-blur would otherwise become
          // the containing block for this fixed panel and clip it to the header.
          document.body,
        )}
    </div>
  );
}
