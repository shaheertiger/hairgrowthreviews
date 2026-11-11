import type { Metadata } from "next";
import { staticPages } from "@/lib/pages";
import { markdownMeta } from "@/lib/md/meta";
import Link from "next/link";
import { reviews } from "@/data/reviews";
import RatingBadge from "@/components/ui/RatingBadge";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { reviewHref } from "@/lib/links";
import { collectionJsonLd } from "@/lib/schema";

const page = staticPages.reviews;

export const metadata: Metadata = {
  title: { absolute: page.title },
  description: page.description,
  ...markdownMeta(page.path, page.aiSummary),
  openGraph: { title: page.title, description: page.description },
};

export default function ReviewsIndexPage() {
  const sorted = [...reviews].sort((a, b) => b.rating - a.rating);
  const top = sorted[0];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionJsonLd(
              page.path,
              "Hair Growth Product Reviews",
              page.description,
              sorted.map((r) => ({ name: r.productName, path: reviewHref(r.slug) })),
            ),
          ),
        }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Reviews" }]} />
      <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">Hair Growth Product Reviews</h1>
      <p className="mt-3 max-w-2xl text-lg text-stone-600">
        {sorted.length} hair loss serums, shampoos, supplements and tools, each rated out of 5 on its ingredients,
        published clinical evidence, price and verified customer feedback — not manufacturer marketing copy.
      </p>

      <div className="mt-6 max-w-3xl rounded-2xl border border-brand-200 bg-brand-50/60 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Quick answer</p>
        <p className="mt-2 font-medium leading-relaxed text-stone-800">
          The highest-rated product we&apos;ve reviewed is {top.productName} ({top.rating.toFixed(1)}/5), because its
          active ingredient has real published research behind it at a low price. Most other hair growth serums score
          2.6-4.0/5: their ingredients are plausible, but few have been tested as a finished product. For proven
          regrowth, minoxidil and finasteride still lead.
        </p>
      </div>

      {/* Crawlable comparison table: every review in plain HTML, ranked by rating. */}
      <h2 className="mt-10 text-2xl font-extrabold text-stone-900">All Reviews, Ranked by Rating</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface-muted text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={r.slug} className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted"}>
                <td className="px-4 py-3 font-semibold">
                  <Link href={reviewHref(r.slug)} className="text-brand-700 underline hover:text-brand-800">
                    {r.productName}
                  </Link>
                </td>
                <td className="px-4 py-3 font-bold text-stone-900">{r.rating.toFixed(1)}/5</td>
                <td className="px-4 py-3 text-stone-600">{r.category}</td>
                <td className="px-4 py-3 text-stone-600">{r.price}</td>
                <td className="px-4 py-3 text-stone-600">{r.verdictLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-2xl font-extrabold text-stone-900">Browse the Reviews</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((r) => (
          <Link
            key={r.slug}
            href={reviewHref(r.slug)}
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
