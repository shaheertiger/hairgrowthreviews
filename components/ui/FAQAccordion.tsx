import { FaqItem } from "@/lib/types";

export default function FAQAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="my-6 divide-y divide-border-subtle rounded-xl border border-border-subtle bg-surface">
      {items.map((item) => (
        <details key={item.q} className="group p-5 open:bg-surface-muted">
          <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-stone-900">
            {item.q}
            <span className="ml-4 shrink-0 text-brand-600 transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
