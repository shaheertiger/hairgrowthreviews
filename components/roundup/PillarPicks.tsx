import Link from "next/link";
import { RoundupData } from "@/lib/types";
import { amazonProductLink } from "@/lib/affiliate";
import RatingBadge from "@/components/ui/RatingBadge";
import ProductThumb from "./ProductThumb";

/** The top picks from a buyer's guide, shown on a question post so a reader
 *  who came for an answer is one tap from the products that answer points to. */
export default function PillarPicks({
  pillar,
  count = 3,
  heading,
}: {
  pillar: RoundupData;
  count?: number;
  heading?: string;
}) {
  const picks = pillar.products.slice(0, count);
  return (
    <section className="my-8 overflow-hidden rounded-2xl border-2 border-accent-500 bg-surface">
      <div className="flex items-center justify-between gap-3 bg-accent-500 px-4 py-2.5 sm:px-5">
        <p className="text-xs font-black uppercase tracking-wide text-white">
          {heading ?? `Top Picks: ${pillar.crumb}`}
        </p>
      </div>
      <ol className="divide-y divide-border-subtle">
        {picks.map((p) => (
          <li key={p.id} className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5">
            <ProductThumb asin={p.asin} alt={p.name} size={56} />
            <div className="min-w-0 flex-1">
              <p className="text-[0.7rem] font-black uppercase tracking-wide text-brand-700">{p.badge}</p>
              <p className="line-clamp-2 text-sm font-bold leading-snug text-stone-900">{p.name}</p>
              <div className="mt-0.5 hidden sm:block">
                <RatingBadge rating={p.score} size="sm" />
              </div>
            </div>
            <a
              href={amazonProductLink(p.name, p.asin)}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="shrink-0 rounded-lg bg-accent-500 px-3 py-2 text-center text-xs font-black uppercase tracking-wide text-white hover:bg-accent-600 sm:px-4"
            >
              Check Price
            </a>
          </li>
        ))}
      </ol>
      <Link
        href={`/${pillar.slug}`}
        className="block border-t border-border-subtle bg-surface-muted px-4 py-3 text-center text-sm font-bold text-brand-700 hover:bg-brand-50"
      >
        See all {pillar.products.length} picks in our {pillar.crumb} guide →
      </Link>
    </section>
  );
}
