import Link from "next/link";
import type { Metadata } from "next";
import { reviews } from "@/data/reviews";
import { guides } from "@/data/guides";
import RatingBadge from "@/components/ui/RatingBadge";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — Independent Hair Loss & Regrowth Product Reviews`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const featured = ["biotopic-premium-hair-regrowth-serum", "amplixin-intensive-hair-growth-serum", "crinagen", "ultrax-labs-hair-lush", "revivogen-scalp-therapy-formula", "nizoral-d-anti-dandruff-shampoo"]
    .map((slug) => reviews.find((r) => r.slug === slug))
    .filter((r): r is NonNullable<typeof r> => !!r);

  const educationLinks = guides.filter((g) => g.section === "about-hair-growth");

  return (
    <div>
      <section className="border-b border-border-subtle bg-gradient-to-b from-brand-50 to-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">
            Independent, Research-Backed Reviews
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight text-stone-900 sm:text-5xl">
            Hair Regrowth Products, Reviewed Honestly
          </h1>
          <p className="mt-5 max-w-xl text-lg text-stone-600">
            We research real ingredients, clinical evidence, and verified customer sentiment for every hair
            growth serum, shampoo, and supplement we cover — not manufacturer marketing copy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/reviews"
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700"
            >
              Browse All Reviews
            </Link>
            <Link
              href="/the-hgr-regimen"
              className="rounded-full border border-brand-600 px-6 py-3 text-sm font-bold text-brand-700 hover:bg-brand-50"
            >
              See the HGR Regimen
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 sm:max-w-md">
            <div>
              <p className="text-2xl font-extrabold text-brand-700">{reviews.length}+</p>
              <p className="text-xs text-stone-500">Products Reviewed</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-brand-700">100%</p>
              <p className="text-xs text-stone-500">Independently Researched</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-brand-700">2026</p>
              <p className="text-xs text-stone-500">Last Updated</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">Most-Read Reviews</h2>
          <Link href="/reviews" className="text-sm font-bold text-brand-700 hover:underline">
            See all →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((r) => (
            <Link
              key={r.slug}
              href={`/reviews/${r.slug}`}
              className="rounded-xl border border-border-subtle bg-surface p-5 transition-shadow hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{r.category}</p>
              <p className="mt-1 text-lg font-bold text-stone-900">{r.productName}</p>
              <p className="mt-1 line-clamp-2 text-sm text-stone-500">{r.dek}</p>
              <div className="mt-3">
                <RatingBadge rating={r.rating} reviewCount={r.reviewCount} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border-subtle bg-surface-muted">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">Understand Hair Loss First</h2>
          <p className="mt-2 max-w-xl text-stone-600">
            Before you buy anything, understand the biology — the hair growth cycle, DHT&apos;s role, and how to
            read a hair-loss stage.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {educationLinks.map((g) => (
              <Link
                key={g.slug}
                href={`/about-hair-growth/${g.slug}`}
                className="rounded-xl border border-border-subtle bg-surface p-5 transition-shadow hover:shadow-md"
              >
                <p className="font-bold text-stone-900">{g.h1}</p>
                <p className="mt-1 line-clamp-2 text-sm text-stone-500">{g.dek}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">Find a Treatment</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <Link href="/find-a-treatment/minoxidil-rogaine" className="rounded-xl border border-border-subtle bg-surface p-5 hover:shadow-md">
            <p className="font-bold text-stone-900">Minoxidil & Rogaine</p>
            <p className="mt-1 text-sm text-stone-500">The most clinically proven OTC option, explained</p>
          </Link>
          <Link href="/find-a-treatment/supplements" className="rounded-xl border border-border-subtle bg-surface p-5 hover:shadow-md">
            <p className="font-bold text-stone-900">Supplements</p>
            <p className="mt-1 text-sm text-stone-500">What actually works vs. what&apos;s marketing hype</p>
          </Link>
          <Link href="/find-a-treatment/scalp-reduction" className="rounded-xl border border-border-subtle bg-surface p-5 hover:shadow-md">
            <p className="font-bold text-stone-900">Scalp Reduction Surgery</p>
            <p className="mt-1 text-sm text-stone-500">Why it&apos;s largely been replaced by FUE/FUT</p>
          </Link>
        </div>
      </section>

      <section className="border-t border-border-subtle bg-brand-900">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">How We Review Products</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Every review on this site is built from real ingredient research, published clinical evidence where
            it exists, and verified customer sentiment — with unverified manufacturer claims clearly labeled as
            such.
          </p>
          <Link
            href="/about#editorial-process"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50"
          >
            Read Our Editorial Process
          </Link>
        </div>
      </section>
    </div>
  );
}
