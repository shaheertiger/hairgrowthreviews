import Link from "next/link";
import { RoundupData } from "@/lib/types";
import { amazonProductLink } from "@/lib/affiliate";
import { site } from "@/lib/site";
import { roundups } from "@/data/roundups";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AuthorBlock from "@/components/AuthorBlock";
import TableOfContents from "@/components/ui/TableOfContents";
import StickyToc from "@/components/ui/StickyToc";
import ReadingProgress from "@/components/ui/ReadingProgress";
import KeyTakeaways from "@/components/ui/KeyTakeaways";
import ArticleSection from "@/components/ui/ArticleSection";
import ComparisonTable from "@/components/ui/ComparisonTable";
import FAQAccordion from "@/components/ui/FAQAccordion";
import BottomLineBox from "@/components/ui/BottomLineBox";
import RelatedReviews from "@/components/RelatedReviews";
import QuickPicks from "@/components/roundup/QuickPicks";
import ProductCard from "@/components/roundup/ProductCard";
import MistakesList from "@/components/roundup/MistakesList";

function monthYear(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export default function RoundupTemplate({ data }: { data: RoundupData }) {
  const before = data.sections.slice(0, data.picksAfter);
  const after = data.sections.slice(data.picksAfter);
  const top = data.products[0];
  const related = data.relatedRoundups
    .map((slug) => roundups.find((r) => r.slug === slug))
    .filter((r): r is RoundupData => !!r);

  const tocItems = [
    { id: "overview", label: "Overview" },
    ...before.map((s) => ({ id: s.id, label: s.heading })),
    { id: "top-picks", label: data.picksHeading },
    ...after.map((s) => ({ id: s.id, label: s.heading })),
    ...(data.comparisonTable ? [{ id: "comparison", label: "Compared Side by Side" }] : []),
    { id: "mistakes", label: "Common Mistakes to Avoid" },
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "bottom-line", label: "The Bottom Line" },
  ];

  // Number sections continuously across the product block.
  const n0 = before.length + 1;

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Best Picks", href: "/best" },
            { label: data.crumb },
          ]}
        />

        <header className="mt-5 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Buyer&apos;s Guide
            </span>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              Updated {monthYear(data.updatedDate)}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-[2.6rem] sm:leading-[1.15]">
            {data.h1}
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-stone-600">{data.dek}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`#${top.id}`}
              className="rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white hover:bg-accent-600"
            >
              See Our #1 Pick
            </a>
            <a
              href="#top-picks"
              className="rounded-full border border-brand-600 px-6 py-3 text-sm font-bold text-brand-700 hover:bg-brand-50"
            >
              Jump to All {data.products.length} Picks
            </a>
          </div>

          <div className="mt-6 border-y border-border-subtle py-4">
            <AuthorBlock updatedDate={data.updatedDate} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-stone-400">{site.disclosure}</p>
        </header>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
          <article className="min-w-0 max-w-3xl">
            <KeyTakeaways items={data.keyTakeaways} />

            <QuickPicks products={data.products} />

            <div className="lg:hidden">
              <TableOfContents items={tocItems} />
            </div>

            <section id="overview" className="prose-content mt-10 scroll-mt-24">
              {data.intro.map((p, i) => (
                <p key={i} className={i === 0 ? "lead" : undefined}>
                  {p}
                </p>
              ))}
            </section>

            <div className="mt-10 space-y-10">
              {before.map((section, i) => (
                <ArticleSection key={section.id} section={section} index={i + 1} />
              ))}
            </div>

            <section id="top-picks" className="mt-10 scroll-mt-24 border-t border-border-subtle pt-10">
              <div className="prose-content">
                <h2 className="flex items-baseline gap-3">
                  <span aria-hidden className="shrink-0 text-sm font-black tabular-nums text-brand-400">
                    {String(n0).padStart(2, "0")}
                  </span>
                  <span>{data.picksHeading}</span>
                </h2>
                <p>{data.picksIntro}</p>
              </div>
              {data.products.map((product, i) => (
                <ProductCard key={product.id} product={product} rank={i + 1} />
              ))}
            </section>

            <div className="mt-10 space-y-10">
              {after.map((section, i) => (
                <ArticleSection key={section.id} section={section} index={n0 + 1 + i} />
              ))}
            </div>

            {data.comparisonTable && (
              <section
                id="comparison"
                className="prose-content mt-10 scroll-mt-24 border-t border-border-subtle pt-10"
              >
                <h2>Compared Side by Side</h2>
                <ComparisonTable data={data.comparisonTable} firstColLabel="Product" />
              </section>
            )}

            <section id="mistakes" className="prose-content mt-10 scroll-mt-24 border-t border-border-subtle pt-10">
              <h2>Common Mistakes to Avoid</h2>
              <MistakesList items={data.mistakes} />
            </section>

            <section id="faq" className="prose-content mt-10 scroll-mt-24 border-t border-border-subtle pt-10">
              <h2>Frequently Asked Questions</h2>
              <FAQAccordion items={data.faq} />
            </section>

            <section id="bottom-line" className="scroll-mt-24">
              <BottomLineBox
                text={data.bottomLine}
                ctaLabel={`Check Price: ${top.name} →`}
                ctaHref={amazonProductLink(top.name, top.asin)}
              />
            </section>

            {related.length > 0 && (
              <div className="my-8">
                <h2 className="mb-4 text-2xl font-bold text-brand-900">More Buyer&apos;s Guides</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/${r.slug}`}
                      className="rounded-xl border border-border-subtle bg-surface p-4 transition-shadow hover:shadow-md"
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{r.hub}</p>
                      <p className="mt-1 font-bold text-stone-900">{r.crumb}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-stone-500">{r.dek}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {data.relatedGuides && data.relatedGuides.length > 0 && (
              <div className="my-8">
                <h2 className="mb-4 text-2xl font-bold text-brand-900">Learn More First</h2>
                <ul className="space-y-2">
                  {data.relatedGuides.map((g) => (
                    <li key={g.href}>
                      <Link href={g.href} className="font-semibold text-brand-700 hover:underline">
                        {g.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.relatedReviewSlugs && data.relatedReviewSlugs.length > 0 && (
              <RelatedReviews slugs={data.relatedReviewSlugs} />
            )}
          </article>

          <aside className="hidden lg:block">
            <StickyToc items={tocItems} />
          </aside>
        </div>
      </div>
    </>
  );
}
