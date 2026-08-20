interface TocItem {
  id: string;
  label: string;
}

/** Collapsible contents list, used on small screens where a sticky sidebar
 *  would eat too much of the viewport. */
export default function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <details className="group rounded-xl border border-border-subtle bg-surface-muted">
      <summary className="flex cursor-pointer list-none items-center justify-between p-4 [&::-webkit-details-marker]:hidden">
        <span className="text-xs font-bold uppercase tracking-wide text-brand-700">
          On This Page · {items.length} sections
        </span>
        <span
          aria-hidden
          className="text-lg leading-none text-brand-600 transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <nav aria-label="Table of contents" className="px-4 pb-4">
        <ol className="space-y-2">
          {items.map((item, i) => (
            <li key={item.id} className="flex gap-2.5 text-sm">
              <span className="font-bold tabular-nums text-brand-400">{String(i + 1).padStart(2, "0")}</span>
              <a href={`#${item.id}`} className="text-stone-700 hover:text-brand-700 hover:underline">
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
