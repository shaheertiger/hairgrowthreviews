import { RoundupProduct } from "@/lib/types";
import { amazonImage, amazonProductLink } from "@/lib/affiliate";
import RatingBadge from "@/components/ui/RatingBadge";
import ProsConsBox from "@/components/ui/ProsConsBox";

export default function ProductCard({ product, rank }: { product: RoundupProduct; rank: number }) {
  const href = amazonProductLink(product.name, product.asin);
  const image = amazonImage(product.asin);

  return (
    <div id={product.id} className="mt-10 scroll-mt-24 first:mt-6">
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm">
        <div className="flex items-center justify-between gap-4 bg-brand-900 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500 text-sm font-black text-white">
              {rank}
            </span>
            <div className="min-w-0">
              <p className="text-base font-black leading-snug text-white sm:text-lg">{product.name}</p>
              <p className="text-xs text-brand-100">{product.category}</p>
            </div>
          </div>
          <span className="hidden shrink-0 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white sm:block">
            {product.badge}
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex gap-4 sm:gap-5">
            {image && (
              <a href={href} target="_blank" rel="sponsored nofollow noopener" className="shrink-0 self-start">
                {/* Amazon-hosted listing image; served as-is per the Associates terms. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={product.name}
                  loading="lazy"
                  width={140}
                  height={140}
                  className="h-24 w-24 rounded-xl bg-white object-contain p-2 ring-1 ring-border-subtle sm:h-36 sm:w-36"
                />
              </a>
            )}
            <div className="min-w-0 flex-1">
              <span className="mb-2 inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-[0.7rem] font-bold text-brand-800 sm:hidden">
                {product.badge}
              </span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <RatingBadge rating={product.score} />
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-400">Our score</span>
              </div>
              <p className="mt-2 text-sm text-stone-600">
                <span className="font-bold text-stone-800">Best for:</span> {product.bestFor}
              </p>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-surface-muted p-3 text-sm">
            {product.keySpecs.map((s) => (
              <div key={s.label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-stone-400">{s.label}</dt>
                <dd className="font-semibold text-stone-800">{s.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href={href}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="mt-4 block rounded-xl bg-accent-500 py-3.5 text-center text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-accent-600"
          >
            Check Price on Amazon →
          </a>

          <div className="prose-content mt-6">
            {product.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <ProsConsBox pros={product.pros} cons={product.cons} />

          <div className="rounded-xl border border-border-subtle bg-surface-muted p-4">
            <p className="text-xs font-black uppercase tracking-wide text-stone-500">The Bottom Line</p>
            <p className="mt-1 font-bold text-stone-900">{product.bottomLine}</p>
          </div>

          <a
            href={href}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="mt-6 block rounded-xl bg-brand-600 py-4 text-center text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-brand-700"
          >
            See {product.brand} on Amazon →
          </a>
        </div>
      </div>
    </div>
  );
}
