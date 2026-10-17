import { RoundupProduct } from "@/lib/types";
import { amazonProductLink } from "@/lib/affiliate";
import RatingBadge from "@/components/ui/RatingBadge";
import ProductThumb from "./ProductThumb";

/** The #1 pick with a buy button, placed directly under the H1 so the first
 *  affiliate link is above the fold on a phone. */
export default function TopPickBox({ product, total }: { product: RoundupProduct; total: number }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border-2 border-accent-500 bg-surface shadow-sm">
      <div className="flex items-center justify-between bg-accent-500 px-4 py-2">
        <p className="text-xs font-black uppercase tracking-wide text-white">Our #1 Pick</p>
        <p className="text-xs font-bold text-white/90">{product.badge}</p>
      </div>
      <div className="flex gap-4 p-4">
        <a href={amazonProductLink(product.name, product.asin)} target="_blank" rel="sponsored nofollow noopener">
          <ProductThumb asin={product.asin} alt={product.name} size={88} />
        </a>
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-snug text-stone-900">{product.name}</p>
          <div className="mt-1">
            <RatingBadge rating={product.score} size="sm" />
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-stone-600">{product.bestFor}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-4 pb-4 sm:flex-row">
        <a
          href={amazonProductLink(product.name, product.asin)}
          target="_blank"
          rel="sponsored nofollow noopener"
          className="flex-1 rounded-xl bg-accent-500 py-3.5 text-center text-sm font-black uppercase tracking-wide text-white hover:bg-accent-600"
        >
          Check Price on Amazon →
        </a>
        <a
          href="#top-picks"
          className="rounded-xl border border-brand-600 px-5 py-3 text-center text-sm font-bold text-brand-700 hover:bg-brand-50"
        >
          See All {total} Picks
        </a>
      </div>
    </div>
  );
}
