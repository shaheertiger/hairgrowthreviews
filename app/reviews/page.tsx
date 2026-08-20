import type { Metadata } from "next";
import Link from "next/link";
import { reviews } from "@/data/reviews";
import RatingBadge from "@/components/ui/RatingBadge";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Hair Growth Product Reviews",
  description:
    "Independent, research-backed reviews of hair regrowth serums, shampoos, and supplements — real ingredients, real evidence, honest verdicts.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsIndexPage() {
  const sorted = [...reviews].sort((a, b) => b.rating - a.rating);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Reviews" }]} />
      <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Hair Growth Product Reviews</h1>
      <p className="mt-3 max-w-2xl text-lg text-stone-600">
        Every product below was researched for real ingredients, clinical evidence, pricing, and verified customer
        sentiment — not manufacturer marketing copy.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((r) => (
          <Link
            key={r.slug}
            href={`/reviews/${r.slug}`}
            className="rounded-xl border border-border-subtle bg-surface p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{r.category}</p>
            <p className="mt-1 text-lg font-bold text-stone-900">{r.productName}</p>
            <p className="mt-1 text-sm text-stone-500">{r.verdictLabel}</p>
            <div className="mt-3">
              <RatingBadge rating={r.rating} reviewCount={r.reviewCount} size="sm" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
