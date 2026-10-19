import { ProductPick } from "@/lib/types";
import { amazonUrl } from "@/lib/affiliate";
import RatingBadge from "@/components/ui/RatingBadge";
import CTAButton from "@/components/ui/CTAButton";

/** Full product card for a buying guide: award, score, specs, write-up, pros/cons, Amazon button. */
export default function ProductCard({ product, rank }: { product: ProductPick; rank: number }) {
  const href = amazonUrl(product);
  return (
    <section
      id={product.id}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-border-subtle bg-surface-muted px-5 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white">
          {rank}
        </span>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
          {product.award}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{product.brand}</p>
        <h3 className="mt-1 text-xl font-extrabold leading-snug text-stone-900 sm:text-2xl">{product.name}</h3>
        <div className="mt-2">
          <RatingBadge rating={product.score} />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border-subtle bg-border-subtle text-sm sm:grid-cols-3">
          <div className="bg-surface p-3">
            <dt className="text-[0.7rem] font-bold uppercase tracking-wide text-stone-400">Price</dt>
            <dd className="mt-0.5 font-semibold text-stone-800">
              {product.price}
              {product.size && <span className="font-normal text-stone-500"> · {product.size}</span>}
            </dd>
          </div>
          <div className="col-span-1 bg-surface p-3 sm:col-span-2">
            <dt className="text-[0.7rem] font-bold uppercase tracking-wide text-stone-400">Best For</dt>
            <dd className="mt-0.5 font-semibold text-stone-800">{product.bestFor}</dd>
          </div>
          <div className="col-span-2 bg-surface p-3 sm:col-span-3">
            <dt className="text-[0.7rem] font-bold uppercase tracking-wide text-stone-400">Key Ingredients / Specs</dt>
            <dd className="mt-0.5 text-stone-700">{product.keyIngredients.join(" · ")}</dd>
          </div>
        </dl>

        <div className="prose-content mt-5">
          {product.summary.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-brand-800">Pros</p>
            <ul className="space-y-2">
              {product.pros.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-stone-700">
                  <span aria-hidden className="text-brand-600">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-red-800">Cons</p>
            <ul className="space-y-2">
              {product.cons.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-stone-700">
                  <span aria-hidden className="text-red-500">✕</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <CTAButton href={href} label="Check Price on Amazon →" />
          <span className="text-xs text-stone-400">Price and availability change often.</span>
        </div>
      </div>
    </section>
  );
}
