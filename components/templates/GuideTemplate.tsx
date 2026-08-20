import { GuideData } from "@/lib/types";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AuthorBlock from "@/components/AuthorBlock";
import TableOfContents from "@/components/ui/TableOfContents";
import StickyToc from "@/components/ui/StickyToc";
import ReadingProgress from "@/components/ui/ReadingProgress";
import KeyTakeaways from "@/components/ui/KeyTakeaways";
import ArticleSection from "@/components/ui/ArticleSection";
import ComparisonTable from "@/components/ui/ComparisonTable";
import StatGrid from "@/components/ui/StatGrid";
import FAQAccordion from "@/components/ui/FAQAccordion";
import BottomLineBox from "@/components/ui/BottomLineBox";
import RelatedReviews from "@/components/RelatedReviews";

const sectionLabels: Record<GuideData["section"], string> = {
  "find-a-treatment": "Find a Treatment",
  "about-hair-growth": "About Hair Growth",
  "the-hgr-regimen": "The HGR Regimen",
};

export default function GuideTemplate({ data }: { data: GuideData }) {
  const tocItems = [
    { id: "overview", label: "Overview" },
    ...data.sections.map((s) => ({ id: s.id, label: s.heading })),
    ...(data.comparisonTable ? [{ id: "comparison", label: "Compared Side by Side" }] : []),
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "bottom-line", label: "The Bottom Line" },
  ];

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: sectionLabels[data.section], href: `/${data.section}` },
            { label: data.h1 },
          ]}
        />

        <header className="mt-5 max-w-3xl">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
            {sectionLabels[data.section]}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-[2.6rem] sm:leading-[1.15]">
            {data.h1}
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-stone-600">{data.dek}</p>

          <div className="mt-6 border-y border-border-subtle py-4">
            <AuthorBlock updatedDate={data.updatedDate} />
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
          <article className="min-w-0 max-w-3xl">
            {data.keyTakeaways && <KeyTakeaways items={data.keyTakeaways} />}

            {data.quickFacts && <StatGrid facts={data.quickFacts} />}

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
              {data.sections.map((section, i) => (
                <ArticleSection key={section.id} section={section} index={i + 1} />
              ))}
            </div>

            {data.comparisonTable && (
              <section
                id="comparison"
                className="prose-content mt-10 scroll-mt-24 border-t border-border-subtle pt-10"
              >
                <h2>{data.comparisonTableTitle ?? "Compared Side by Side"}</h2>
                <ComparisonTable data={data.comparisonTable} firstColLabel="" />
              </section>
            )}

            <section id="faq" className="prose-content mt-10 scroll-mt-24 border-t border-border-subtle pt-10">
              <h2>Frequently Asked Questions</h2>
              <FAQAccordion items={data.faq} />
            </section>

            <section id="bottom-line" className="scroll-mt-24">
              <BottomLineBox text={data.bottomLine} />
            </section>

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
