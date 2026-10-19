import type { Metadata } from "next";
import Link from "next/link";
import { buyingGuides } from "@/data/buying-guides";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Hair Growth Buying Guides: The Best Products by Category",
  description:
    "Research-backed buying guides to the best hair growth shampoos, serums, oils, vitamins, minoxidil, devices and more — ranked on ingredients, evidence and value.",
  alternates: { canonical: "/best" },
};

export default function BuyingGuidesIndexPage() {
  const categories = Array.from(new Set(buyingGuides.map((g) => g.category)));
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Buying Guides" }]} />
      <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Hair Growth Buying Guides</h1>
      <p className="mt-3 max-w-2xl text-lg text-stone-600">
        Every guide ranks products on active ingredients, the strength of the evidence behind them, value per dose,
        and verified customer sentiment — so you can skip the marketing and buy the right thing.
      </p>
      {categories.map((cat) => (
        <section key={cat} className="mt-10">
          <h2 className="text-xl font-bold text-brand-900">{cat}</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {buyingGuides
              .filter((g) => g.category === cat)
              .map((g) => (
                <Link
                  key={g.slug}
                  href={`/best/${g.slug}`}
                  className="rounded-xl border border-border-subtle bg-surface p-5 transition-shadow hover:shadow-md"
                >
                  <p className="text-lg font-bold text-stone-900">Best {g.shortTitle}</p>
                  <p className="mt-1 text-sm text-stone-500">{g.dek}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-brand-600">
                    {g.products.length} picks →
                  </p>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
