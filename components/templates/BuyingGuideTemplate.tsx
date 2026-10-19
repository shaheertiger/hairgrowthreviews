import Link from "next/link";
import { BuyingGuideData } from "@/lib/types";
import { buyingGuides } from "@/data/buying-guides";
import { site } from "@/lib/site";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AuthorBlock from "@/components/AuthorBlock";
import TableOfContents from "@/components/ui/TableOfContents";
import StickyToc from "@/components/ui/StickyToc";
import ReadingProgress from "@/components/ui/ReadingProgress";
import KeyTakeaways from "@/components/ui/KeyTakeaways";
import ArticleSection from "@/components/ui/ArticleSection";
import FAQAccordion from "@/components/ui/FAQAccordion";
import BottomLineBox from "@/components/ui/BottomLineBox";
import CalloutBox from "@/components/ui/CalloutBox";
import RelatedReviews from "@/components/RelatedReviews";
import ProductCard from "@/components/buying/ProductCard";
import TopPicksTable from "@/components/buying/TopPicksTable";

export default function BuyingGuideTemplate({ data }: { data: BuyingGuideData }) {
  const tocItems = [
    { id: "top-picks", label: "Top Picks at a Glance" },
    { id: "overview", label: "Overview" },
    { id: "picks", label: `The ${data.products.length} Best Picks` },
    ...data.sections.map((s) => ({ id: s.id, label: s.heading })),
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "bottom-line", label: "The Bottom Line" },
  ];

  const relatedGuides = data.relatedGuideSlugs
    .map((s) => buyingGuides.find((g) => g.slug === s))
    .filter((g): g is BuyingGuideData => !!g);

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Buying Guides", href: "/best" }, { label: data.shortTitle }]}
        />

        <header className="mt-5 max-w-3xl">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
            {data.category}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-[2.6rem] sm:leading-[1.15]">
            {data.h1}
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-stone-600">{data.dek}</p>

          <div className="mt-6 border-y border-border-subtle py-4">
            <AuthorBlock updatedDate={data.updatedDate} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-stone-400">
            {site.name} is reader-supported. As an Amazon Associate we earn from qualifying purchases, at no extra cost
            to you. <Link href="/about#editorial-process" className="underline hover:text-brand-700">How we choose products</Link>.
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
          <article className="min-w-0 max-w-3xl">
            <KeyTakeaways items={data.keyTakeaways} />

            <TopPicksTable products={data.products} />

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

            <CalloutBox title="How we picked">{data.methodology}</CalloutBox>

            <section id="picks" className="mt-10 scroll-mt-24 border-t border-border-subtle pt-10">
              <h2 className="mb-6 text-2xl font-bold text-brand-900">
                The {data.products.length} Best {data.shortTitle}
              </h2>
              <div className="space-y-8">
                {data.products.map((p, i) => (
                  <ProductCard key={p.id} product={p} rank={i + 1} />
                ))}
              </div>
            </section>

            <div className="mt-10 space-y-10">
              {data.sections.map((section, i) => (
                <ArticleSection key={section.id} section={section} index={i + 1} />
              ))}
            </div>

            <section id="faq" className="prose-content mt-10 scroll-mt-24 border-t border-border-subtle pt-10">
              <h2>Frequently Asked Questions</h2>
              <FAQAccordion items={data.faq} />
            </section>

            <section id="bottom-line" className="scroll-mt-24">
              <BottomLineBox text={data.bottomLine} />
            </section>

            {relatedGuides.length > 0 && (
              <div className="my-8">
                <h2 className="mb-4 text-2xl font-bold text-brand-900">More Buying Guides</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {relatedGuides.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/best/${g.slug}`}
                      className="rounded-xl border border-border-subtle bg-surface p-4 transition-shadow hover:shadow-md"
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{g.category}</p>
                      <p className="mt-1 font-bold text-stone-900">Best {g.shortTitle}</p>
                    </Link>
                  ))}
                </div>
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
