import { GuideData } from "@/lib/types";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AuthorBlock from "@/components/AuthorBlock";
import TableOfContents from "@/components/ui/TableOfContents";
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
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "bottom-line", label: "The Bottom Line" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: sectionLabels[data.section], href: `/${data.section}` },
          { label: data.h1 },
        ]}
      />

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-600">{sectionLabels[data.section]}</p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight text-stone-900 sm:text-4xl">{data.h1}</h1>
      <p className="mt-3 text-lg text-stone-600">{data.dek}</p>

      <div className="mt-6 border-y border-border-subtle py-4">
        <AuthorBlock updatedDate={data.updatedDate} />
      </div>

      <div className="mt-8">
        <TableOfContents items={tocItems} />
      </div>

      <section id="overview" className="prose-content mt-8">
        {data.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {data.quickFacts && <StatGrid facts={data.quickFacts} />}
      </section>

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

      <section id="faq" className="prose-content mt-4">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion items={data.faq} />
      </section>

      <section id="bottom-line">
        <BottomLineBox text={data.bottomLine} />
      </section>

      {data.relatedReviewSlugs && data.relatedReviewSlugs.length > 0 && (
        <RelatedReviews slugs={data.relatedReviewSlugs} />
      )}
    </div>
  );
}
