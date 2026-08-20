"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  label: string;
}

export default function StickyToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    function onScroll() {
      // The active section is the last one whose top has passed the reading line.
      const readingLine = window.innerHeight * 0.3;
      let current = headings[0].id;
      for (const el of headings) {
        if (el.getBoundingClientRect().top <= readingLine) {
          current = el.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <nav aria-label="Table of contents" className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-stone-400">On This Page</p>
      <ul className="space-y-1 border-l border-border-subtle">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors ${
                  isActive
                    ? "border-brand-600 font-semibold text-brand-700"
                    : "border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-800"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
