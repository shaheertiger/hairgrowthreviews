import Link from "next/link";
import { RoundupData } from "@/lib/types";
import { amazonImage, amazonProductLink } from "@/lib/affiliate";
import { questionsForRoundup, relatedGuidesForRoundup, relatedRoundupsFor, reviewsForRoundup, roundupHref } from "@/lib/links";
import { createLinker } from "@/lib/autolink";
import { GuideLinks, QuestionList, RoundupCards } from "@/components/RelatedLinks";
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
import TopPickBox from "@/components/roundup/TopPickBox";
import StickyBuyBar from "@/components/roundup/StickyBuyBar";
import ProductThumb from "@/components/roundup/ProductThumb";

function monthYear(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export default function RoundupTemplate({ data }: { data: RoundupData }) {
  const before = data.sections.slice(0, data.picksAfter);
  const after = data.sections.slice(data.picksAfter);
  const top = data.products[0];
  const related = relatedRoundupsFor(data);
  const answers = questionsForRoundup(data);
  const guideLinks = relatedGuidesForRoundup(data);
  const relatedReviews = reviewsForRoundup(data);
  const linkify = createLinker(roundupHref(data.slug), ["/best"]);

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
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:py-10 md:pb-10">
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
          <h1 className="mt-4 text-[1.75rem] font-extrabold leading-tight tracking-tight text-stone-900 sm:text-[2.6rem] sm:leading-[1.15]">
            {data.h1}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-stone-600 sm:mt-4 sm:text-xl">{data.dek}</p>

          <TopPickBox product={top} total={data.products.length} />

          <div className="mt-6 border-y border-border-subtle py-4">
            <AuthorBlock updatedDate={data.updatedDate} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-stone-400">
            We may earn a commission when you buy through our links, at no cost to you. As an Amazon Associate we
            earn from qualifying purchases.{" "}
            <Link href="/about#editorial-process" className="underline hover:text-brand-700">
              How we rank
            </Link>
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
          <article className="min-w-0 max-w-3xl">
            <QuickPicks products={data.products} />

            <KeyTakeaways items={data.keyTakeaways} />

            <div className="lg:hidden">
              <TableOfContents items={tocItems} />
            </div>

            <section id="overview" className="prose-content mt-10 scroll-mt-24">
              {data.intro.map((p, i) => (
                <p key={i} className={i === 0 ? "lead" : undefined}>
                  {linkify(p)}
                </p>
              ))}
            </section>

            <div className="mt-10 space-y-10">
              {before.map((section, i) => (
                <ArticleSection key={section.id} section={section} index={i + 1} linkify={linkify} />
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
                <ArticleSection key={section.id} section={section} index={n0 + 1 + i} linkify={linkify} />
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

            <QuickPicks products={data.products} heading="Ready to Buy? Our Picks Again" />

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

            <QuestionList items={answers} heading="Common Questions, Answered" />
            <RoundupCards items={related} heading="More Buyer's Guides" />
            <GuideLinks items={guideLinks} heading="Learn More First" />
            <RelatedReviews items={relatedReviews} heading="In-Depth Product Reviews" />
          </article>

          <aside className="hidden lg:block">
            <StickyToc items={tocItems}>
              <div className="mb-6 rounded-xl border-2 border-accent-500 bg-surface p-3">
                <p className="text-[0.65rem] font-black uppercase tracking-wide text-accent-600">Our #1 Pick</p>
                <div className="mt-2 flex items-center gap-2.5">
                  <ProductThumb asin={top.asin} alt={top.name} size={48} />
                  <p className="line-clamp-3 text-xs font-bold leading-snug text-stone-900">{top.name}</p>
                </div>
                <a
                  href={amazonProductLink(top.name, top.asin)}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="mt-3 block rounded-lg bg-accent-500 py-2 text-center text-xs font-black uppercase tracking-wide text-white hover:bg-accent-600"
                >
                  Check Price
                </a>
              </div>
            </StickyToc>
          </aside>
        </div>
      </div>
      <StickyBuyBar
        name={top.name}
        href={amazonProductLink(top.name, top.asin)}
        image={amazonImage(top.asin)}
      />
    </>
  );
}
