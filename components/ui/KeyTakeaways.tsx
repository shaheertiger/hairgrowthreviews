export default function KeyTakeaways({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section
      aria-labelledby="key-takeaways-heading"
      className="my-8 rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-surface p-6 sm:p-7"
    >
      <p
        id="key-takeaways-heading"
        className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-brand-700"
      >
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs text-white"
        >
          ★
        </span>
        The Short Version
      </p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-[0.95rem] leading-relaxed text-stone-800">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
