import type { Metadata } from "next";
import Link from "next/link";
import { roundups, roundupHubs } from "@/data/roundups";
import { amazonProductLink } from "@/lib/affiliate";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductThumb from "@/components/roundup/ProductThumb";

export const metadata: Metadata = {
  title: "Best Hair Growth & Hair Care Products: Every Buyer's Guide",
  description:
    "Every HairGrowthReviews buyer's guide in one place — the best minoxidil, hair growth shampoos, serums, vitamins, laser caps, hair tools and hair care products, ranked on evidence.",
  alternates: { canonical: "/best" },
};

const hubId = (hub: string) => hub.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function BestIndexPage() {
  const hubs = roundupHubs.filter((hub) => roundups.some((r) => r.hub === hub));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Best Picks" }]} />
      <h1 className="mt-4 text-[1.75rem] font-extrabold leading-tight text-stone-900 sm:text-4xl">
        Best Picks: Every Buyer&apos;s Guide
      </h1>
      <p className="mt-3 max-w-2xl text-base text-stone-600 sm:text-lg">
        {roundups.length} guides ranked on ingredient evidence, clinical data where it exists, value, and what real users
        report — not on who pays the most.
      </p>

      <nav
        aria-label="Guide categories"
        className="sticky top-[61px] z-30 -mx-4 mt-6 flex gap-2 overflow-x-auto border-b border-border-subtle bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {hubs.map((hub) => (
          <a
            key={hub}
            href={`#${hubId(hub)}`}
            className="shrink-0 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-bold text-brand-800 hover:bg-brand-100"
          >
            {hub} ({roundups.filter((r) => r.hub === hub).length})
          </a>
        ))}
      </nav>

      {hubs.map((hub) => (
        <section key={hub} id={hubId(hub)} className="mt-10 scroll-mt-32">
          <h2 className="text-xl font-extrabold text-stone-900 sm:text-2xl">{hub}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roundups
              .filter((r) => r.hub === hub)
              .map((r) => {
                const top = r.products[0];
                return (
                  <div
                    key={r.slug}
                    className="flex flex-col rounded-xl border border-border-subtle bg-surface p-4 transition-shadow hover:shadow-md sm:p-5"
                  >
                    <Link href={`/${r.slug}`} className="group">
                      <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
                        {r.products.length} picks ranked
                      </p>
                      <p className="mt-1 text-lg font-bold text-stone-900 group-hover:text-brand-700">{r.crumb}</p>
                      <p className="mt-1 hidden text-sm text-stone-500 sm:line-clamp-2">{r.dek}</p>
                    </Link>
                    <div className="mt-3 flex items-center gap-3 rounded-lg bg-surface-muted p-2.5">
                      <ProductThumb asin={top.asin} alt={top.name} size={48} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.65rem] font-black uppercase tracking-wide text-accent-600">Our #1 Pick</p>
                        <p className="line-clamp-2 text-sm font-semibold leading-snug text-stone-800">{top.name}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <a
                        href={amazonProductLink(top.name, top.asin)}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                        className="flex-1 rounded-lg bg-accent-500 py-2.5 text-center text-xs font-black uppercase tracking-wide text-white hover:bg-accent-600"
                      >
                        Check Price
                      </a>
                      <Link
                        href={`/${r.slug}`}
                        className="flex-1 rounded-lg border border-brand-600 py-2.5 text-center text-xs font-bold text-brand-700 hover:bg-brand-50"
                      >
                        Read Guide
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
