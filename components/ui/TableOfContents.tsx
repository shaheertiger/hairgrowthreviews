interface TocItem {
  id: string;
  label: string;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <nav aria-label="Table of contents" className="rounded-xl border border-border-subtle bg-surface-muted p-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-700">On This Page</p>
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li key={item.id} className="flex gap-2 text-sm">
            <span className="font-bold text-brand-600">{i + 1}.</span>
            <a href={`#${item.id}`} className="text-stone-700 hover:text-brand-700 hover:underline">
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
