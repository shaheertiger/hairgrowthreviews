import { ReviewData } from "@/lib/types";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AuthorBlock from "@/components/AuthorBlock";
import RatingBadge from "@/components/ui/RatingBadge";
import TableOfContents from "@/components/ui/TableOfContents";
import StickyToc from "@/components/ui/StickyToc";
import ReadingProgress from "@/components/ui/ReadingProgress";
import KeyTakeaways from "@/components/ui/KeyTakeaways";
import ArticleSection from "@/components/ui/ArticleSection";
import ProsConsBox from "@/components/ui/ProsConsBox";
import ComparisonTable from "@/components/ui/ComparisonTable";
import FAQAccordion from "@/components/ui/FAQAccordion";
import BottomLineBox from "@/components/ui/BottomLineBox";
import CTAButton from "@/components/ui/CTAButton";
import CalloutBox from "@/components/ui/CalloutBox";
import RelatedReviews from "@/components/RelatedReviews";

export default function ReviewTemplate({ data }: { data: ReviewData }) {
  const tocItems = [
    { id: "overview", label: "Quick Overview" },
    { id: "pros-cons", label: "Pros & Cons" },
    ...(data.ingredients?.length ? [{ id: "ingredients", label: "Key Ingredients" }] : []),
    ...data.sections.map((s) => ({ id: s.id, label: s.heading })),
    ...(data.comparisonTable ? [{ id: "comparison", label: "How It Compares" }] : []),
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
            { label: "Reviews", href: "/reviews" },
            { label: data.productName },
          ]}
        />

        {/* Hero */}
        <header className="mt-5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
              {data.category}
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
              {data.verdictLabel}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-[2.6rem] sm:leading-[1.15]">
            {data.h1}
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-stone-600">{data.dek}</p>

          <div className="mt-5">
            <RatingBadge rating={data.rating} reviewCount={data.reviewCount} size="lg" />
            <p className="mt-1.5 text-xs text-stone-400">{data.ratingBasis}</p>
          </div>

          <div className="mt-6 border-y border-border-subtle py-4">
            <AuthorBlock updatedDate={data.updatedDate} />
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
          <article className="min-w-0 max-w-3xl">
            {data.keyTakeaways && <KeyTakeaways items={data.keyTakeaways} />}

            {/* Verdict card — the decision-critical facts, up front */}
            <div className="my-8 overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm">
              <div className="grid grid-cols-2 divide-x divide-y divide-border-subtle sm:grid-cols-4 sm:divide-y-0">
                {[
                  { label: "Price", value: data.price },
                  { label: "Best For", value: data.bestFor },
                  { label: "Category", value: data.category },
                  { label: "Verdict", value: data.verdictLabel },
                ].map((f) => (
                  <div key={f.label} className="p-4">
                    <p className="text-[0.7rem] font-bold uppercase tracking-wide text-stone-400">
                      {f.label}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-snug text-stone-900">{f.value}</p>
                  </div>
                ))}
              </div>
              {data.quickFacts.length > 0 && (
                <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border-subtle bg-surface-muted px-4 py-3">
                  {data.quickFacts.map((f) => (
                    <p key={f.label} className="text-xs text-stone-500">
                      <span className="font-semibold text-stone-700">{f.label}:</span> {f.value}
                    </p>
                  ))}
                </div>
              )}
              <div className="border-t border-border-subtle p-4">
                <CTAButton href={data.affiliateUrl} label={`Check Price for ${data.productName} →`} />
              </div>
            </div>

            {/* Mobile TOC */}
            <div className="lg:hidden">
              <TableOfContents items={tocItems} />
            </div>

            <section id="overview" className="prose-content mt-10 scroll-mt-24">
              <h2>Quick Overview</h2>
              {data.intro.map((p, i) => (
                <p key={i} className={i === 0 ? "lead" : undefined}>
                  {p}
                </p>
              ))}
            </section>

            <section id="pros-cons" className="prose-content mt-10 scroll-mt-24 border-t border-border-subtle pt-10">
              <h2>Pros & Cons at a Glance</h2>
              <ProsConsBox pros={data.pros} cons={data.cons} />
            </section>

            {data.ingredients && data.ingredients.length > 0 && (
              <section
                id="ingredients"
                className="prose-content mt-10 scroll-mt-24 border-t border-border-subtle pt-10"
              >
                <h2>Key Ingredients, Decoded</h2>
                <div className="my-6 overflow-hidden rounded-xl border border-border-subtle">
                  <table className="w-full text-sm">
                    <tbody>
                      {data.ingredients.map((ing, i) => (
                        <tr key={ing.name} className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted"}>
                          <td className="w-1/3 px-4 py-3.5 align-top font-bold text-stone-800">
                            {ing.name}
                          </td>
                          <td className="px-4 py-3.5 leading-relaxed text-stone-600">{ing.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            <div className="mt-10 space-y-10">
              {data.sections.map((section, i) => (
                <ArticleSection key={section.id} section={section} index={i + 1} />
              ))}
            </div>

            {data.safetyNote && (
              <CalloutBox title="Safety Note" variant="warning">
                {data.safetyNote}
              </CalloutBox>
            )}

            {data.comparisonTable && (
              <section
                id="comparison"
                className="prose-content mt-10 scroll-mt-24 border-t border-border-subtle pt-10"
              >
                <h2>How {data.productName} Compares</h2>
                <ComparisonTable data={data.comparisonTable} firstColLabel="" />
              </section>
            )}

            <section id="faq" className="prose-content mt-10 scroll-mt-24 border-t border-border-subtle pt-10">
              <h2>Frequently Asked Questions</h2>
              <FAQAccordion items={data.faq} />
            </section>

            <section id="bottom-line" className="scroll-mt-24">
              <BottomLineBox
                text={data.bottomLine}
                ctaLabel={`Check Price for ${data.productName} →`}
                ctaHref={data.affiliateUrl}
              />
              {data.guarantee && (
                <p className="text-xs text-stone-400">Guarantee: {data.guarantee}</p>
              )}
            </section>

            <RelatedReviews slugs={data.relatedSlugs} />
          </article>

          <aside className="hidden lg:block">
            <StickyToc items={tocItems} />
          </aside>
        </div>
      </div>
    </>
  );
}
