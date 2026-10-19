import { RoundupProduct } from "@/lib/types";
import { amazonProductLink } from "@/lib/affiliate";
import ProductThumb from "./ProductThumb";

export default function QuickPicks({
  products,
  heading = "Our Picks at a Glance",
}: {
  products: RoundupProduct[];
  heading?: string;
}) {
  return (
    <section className="my-8 overflow-hidden rounded-2xl border-2 border-accent-500 bg-surface">
      <div className="bg-accent-500 px-4 py-2.5 sm:px-6">
        <p className="text-xs font-black uppercase tracking-wide text-white">{heading}</p>
      </div>
      <ol className="divide-y divide-border-subtle">
        {products.map((p, i) => (
          <li key={p.id} className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5">
            <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-black text-brand-800 sm:flex">
              {i + 1}
            </span>
            <ProductThumb asin={p.asin} alt={p.name} size={52} />
            <div className="min-w-0 flex-1">
              <p className="text-[0.7rem] font-black uppercase tracking-wide text-brand-700">{p.badge}</p>
              <a href={`#${p.id}`} className="line-clamp-2 text-sm font-bold leading-snug text-stone-900 hover:text-brand-700">
                {p.name}
              </a>
            </div>
            <a
              href={amazonProductLink(p.name, p.asin)}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="shrink-0 rounded-lg bg-brand-600 px-3 py-2 text-center text-xs font-bold text-white hover:bg-brand-700 sm:px-4"
            >
              Check Price<span className="hidden sm:inline"> →</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
