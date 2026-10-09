"use client";

import { useEffect, useState } from "react";

/** Mobile-only bar pinned to the bottom of the screen once the reader has
 *  scrolled past the hero, keeping the #1 pick one tap away. */
export default function StickyBuyBar({ name, href, image }: { name: string; href: string; image?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const nearBottom = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 400;
      setVisible(window.scrollY > 700 && !nearBottom);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface/95 px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-md bg-white object-contain" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[0.65rem] font-black uppercase tracking-wide text-accent-600">Our #1 Pick</p>
          <p className="truncate text-sm font-bold text-stone-900">{name}</p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="sponsored nofollow noopener"
          tabIndex={visible ? 0 : -1}
          className="shrink-0 rounded-lg bg-accent-500 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white"
        >
          Check Price
        </a>
      </div>
    </div>
  );
}
