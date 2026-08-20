import { FaqItem } from "@/lib/types";

export default function FAQAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="my-6 space-y-3">
      {items.map((item) => (
        <details
          key={item.q}
          className="group overflow-hidden rounded-xl border border-border-subtle bg-surface transition-colors open:border-brand-300 open:bg-brand-50/40"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 font-semibold text-stone-900 hover:text-brand-700 [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <span
              aria-hidden
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface text-lg leading-none text-brand-600 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="px-5 pb-5 pt-0">
            <p className="text-[0.95rem] leading-relaxed text-stone-600">{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
