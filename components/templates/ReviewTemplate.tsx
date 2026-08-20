import { ReviewData } from "@/lib/types";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AuthorBlock from "@/components/AuthorBlock";
import RatingBadge from "@/components/ui/RatingBadge";
import TableOfContents from "@/components/ui/TableOfContents";
import StatGrid from "@/components/ui/StatGrid";
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
    ...data.sections.map((s) => ({ id: s.id, label: s.heading })),
    ...(data.comparisonTable ? [{ id: "comparison", label: "How It Compares" }] : []),
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "bottom-line", label: "The Bottom Line" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Reviews", href: "/reviews" },
          { label: data.productName },
        ]}
      />

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-600">
        {data.category} Review · {data.verdictLabel}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight text-stone-900 sm:text-4xl">{data.h1}</h1>
      <p className="mt-3 text-lg text-stone-600">{data.dek}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <RatingBadge rating={data.rating} reviewCount={data.reviewCount} size="lg" />
      </div>
      <p className="mt-1 text-xs text-stone-400">{data.ratingBasis}</p>

      <div className="mt-6 border-y border-border-subtle py-4">
        <AuthorBlock updatedDate={data.updatedDate} />
      </div>

      <div className="mt-8">
        <TableOfContents items={tocItems} />
      </div>

      <section id="overview" className="prose-content mt-8">
        <h2>Quick Overview</h2>
        {data.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <StatGrid
          facts={[
            { label: "Price", value: data.price },
            { label: "Best For", value: data.bestFor },
            { label: "Category", value: data.category },
            { label: "Verdict", value: data.verdictLabel },
            ...data.quickFacts,
          ]}
        />
        <div className="mt-4">
          <CTAButton href={data.affiliateUrl} label={`Check Price for ${data.productName} →`} />
        </div>
      </section>

      <section id="pros-cons" className="prose-content mt-4">
        <h2>Pros & Cons</h2>
        <ProsConsBox pros={data.pros} cons={data.cons} />
      </section>

      {data.ingredients && data.ingredients.length > 0 && (
        <section id="ingredients" className="prose-content mt-4">
          <h2>Key Ingredients</h2>
          <div className="my-6 overflow-hidden rounded-xl border border-border-subtle">
            <table className="w-full text-sm">
              <tbody>
                {data.ingredients.map((ing, i) => (
                  <tr key={ing.name} className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted"}>
                    <td className="w-1/3 px-4 py-3 font-bold text-stone-800">{ing.name}</td>
                    <td className="px-4 py-3 text-stone-600">{ing.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {data.sections.map((section) => (
        <section key={section.id} id={section.id} className="prose-content mt-4">
          <h2>{section.heading}</h2>
          {section.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {section.subsections?.map((sub) => (
            <div key={sub.heading}>
              <h3>{sub.heading}</h3>
              {sub.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ))}
        </section>
      ))}

      {data.safetyNote && (
        <CalloutBox title="Safety Note" variant="warning">
          {data.safetyNote}
        </CalloutBox>
      )}

      {data.comparisonTable && (
        <section id="comparison" className="prose-content mt-4">
          <h2>How {data.productName} Compares</h2>
          <ComparisonTable data={data.comparisonTable} firstColLabel="" />
        </section>
      )}

      <section id="faq" className="prose-content mt-4">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion items={data.faq} />
      </section>

      <section id="bottom-line">
        <BottomLineBox
          text={data.bottomLine}
          ctaLabel={`Check Price for ${data.productName} →`}
          ctaHref={data.affiliateUrl}
        />
        {data.guarantee && <p className="text-xs text-stone-400">Guarantee: {data.guarantee}</p>}
      </section>

      <RelatedReviews slugs={data.relatedSlugs} />
    </div>
  );
}
