import { ProductPick } from "@/lib/types";
import { amazonUrl } from "@/lib/affiliate";

/** Compact "at a glance" list of every pick, shown near the top of a buying guide. */
export default function TopPicksTable({ products }: { products: ProductPick[] }) {
  return (
    <section
      id="top-picks"
      aria-labelledby="top-picks-heading"
      className="my-8 scroll-mt-24 overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm"
    >
      <h2 id="top-picks-heading" className="bg-brand-700 px-5 py-3.5 text-base font-bold text-white">
        Our Top Picks at a Glance
      </h2>
      <ol className="divide-y divide-border-subtle">
        {products.map((p, i) => (
          <li key={p.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[0.7rem] font-bold uppercase tracking-wide text-amber-700">
                {i + 1}. {p.award}
              </p>
              <a href={`#${p.id}`} className="font-bold text-stone-900 hover:text-brand-700">
                {p.name}
              </a>
              <p className="text-sm text-stone-500">
                {p.score.toFixed(1)}/5 · {p.price} · {p.bestFor}
              </p>
            </div>
            <a
              href={amazonUrl(p)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-brand-600 px-4 py-2 text-sm font-bold text-brand-700 hover:bg-brand-600 hover:text-white"
            >
              View on Amazon
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
