import { RoundupProduct } from "@/lib/types";
import { amazonProductLink } from "@/lib/affiliate";

export default function QuickPicks({ products }: { products: RoundupProduct[] }) {
  return (
    <section className="my-8 overflow-hidden rounded-2xl border-2 border-accent-500 bg-surface">
      <div className="bg-accent-500 px-6 py-2.5">
        <p className="text-xs font-black uppercase tracking-wide text-white">Our Picks at a Glance</p>
      </div>
      <ol className="divide-y divide-border-subtle">
        {products.map((p, i) => (
          <li key={p.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
            <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-black text-brand-800 sm:flex">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-wide text-brand-700">{p.badge}</p>
              <a href={`#${p.id}`} className="font-bold text-stone-900 hover:text-brand-700">
                {p.name}
              </a>
            </div>
            <a
              href={amazonProductLink(p.name, p.asin)}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="shrink-0 rounded-full bg-brand-600 px-4 py-2 text-center text-xs font-bold text-white hover:bg-brand-700"
            >
              Check Price →
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
