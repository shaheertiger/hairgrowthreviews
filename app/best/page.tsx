import type { Metadata } from "next";
import Link from "next/link";
import { roundups, roundupHubs } from "@/data/roundups";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Best Hair Growth & Hair Care Products: Every Buyer's Guide",
  description:
    "Every HairGrowthReviews buyer's guide in one place — the best minoxidil, hair growth shampoos, serums, vitamins, laser caps, and hair care products, ranked on evidence.",
  alternates: { canonical: "/best" },
};

export default function BestIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Best Picks" }]} />
      <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Best Picks: Every Buyer&apos;s Guide</h1>
      <p className="mt-3 max-w-2xl text-lg text-stone-600">
        Ranked on ingredient evidence, clinical data where it exists, value, and what real users report — not on who
        pays the most.
      </p>
      {roundupHubs.map((hub) => {
        const items = roundups.filter((r) => r.hub === hub);
        if (items.length === 0) return null;
        return (
          <section key={hub} className="mt-12">
            <h2 className="text-2xl font-extrabold text-stone-900">{hub}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className="rounded-xl border border-border-subtle bg-surface p-5 transition-shadow hover:shadow-md"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
                    {r.products.length} picks
                  </p>
                  <p className="mt-1 text-lg font-bold text-stone-900">{r.crumb}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-500">{r.dek}</p>
                  <p className="mt-3 text-sm font-semibold text-stone-700">
                    <span className="text-brand-700">#1:</span> {r.products[0].name}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
