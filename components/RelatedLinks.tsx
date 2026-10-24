import Link from "next/link";
import type { QuestionData, RoundupData } from "@/lib/types";
import { questionHref, roundupHref, type GuideLink } from "@/lib/links";

/** Card grid of buyer's guides. */
export function RoundupCards({ items, heading }: { items: RoundupData[]; heading: string }) {
  if (items.length === 0) return null;
  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl font-bold text-brand-900">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((r) => (
          <Link
            key={r.slug}
            href={roundupHref(r.slug)}
            className="rounded-xl border border-border-subtle bg-surface p-4 transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{r.hub}</p>
            <p className="mt-1 font-bold text-stone-900">{r.crumb}</p>
            <p className="mt-1 line-clamp-2 text-sm text-stone-500">{r.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Divided list of question posts. */
export function QuestionList({ items, heading }: { items: QuestionData[]; heading: string }) {
  if (items.length === 0) return null;
  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl font-bold text-brand-900">{heading}</h2>
      <ul className="divide-y divide-border-subtle rounded-xl border border-border-subtle bg-surface">
        {items.map((q) => (
          <li key={q.slug}>
            <Link href={questionHref(q.slug)} className="block px-4 py-3 font-semibold text-stone-800 hover:text-brand-700">
              {q.h1} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Simple arrow-link list for guides. */
export function GuideLinks({ items, heading }: { items: GuideLink[]; heading: string }) {
  if (items.length === 0) return null;
  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl font-bold text-brand-900">{heading}</h2>
      <ul className="space-y-2">
        {items.map((g) => (
          <li key={g.href}>
            <Link href={g.href} className="font-semibold text-brand-700 hover:underline">
              {g.label} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
