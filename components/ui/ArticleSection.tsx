import { ContentSection } from "@/lib/types";
import PullQuote from "./PullQuote";
import KeyPoint from "./KeyPoint";
import ComparisonTable from "./ComparisonTable";

/**
 * Renders one article section with visual rhythm: a numbered heading, body
 * paragraphs, an optional pull quote woven into the paragraph flow, optional
 * subsections, an optional key-point callout, and an optional table.
 */
export default function ArticleSection({
  section,
  index,
}: {
  section: ContentSection;
  index?: number;
}) {
  // Place the pull quote after the first paragraph so it breaks up the section
  // early, rather than stranding it at the very top or bottom.
  const quoteAfter = section.body.length > 2 ? 1 : 0;

  return (
    <section id={section.id} className="prose-content scroll-mt-24 border-t border-border-subtle pt-10">
      <h2 className="flex items-baseline gap-3">
        {index !== undefined && (
          <span
            aria-hidden
            className="shrink-0 text-sm font-black tabular-nums text-brand-400"
          >
            {String(index).padStart(2, "0")}
          </span>
        )}
        <span>{section.heading}</span>
      </h2>

      {section.body.map((p, i) => (
        <div key={i}>
          <p>{p}</p>
          {section.pullQuote && i === quoteAfter && <PullQuote>{section.pullQuote}</PullQuote>}
        </div>
      ))}

      {section.subsections?.map((sub) => (
        <div key={sub.heading}>
          <h3>{sub.heading}</h3>
          {sub.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ))}

      {section.table && <ComparisonTable data={section.table} />}

      {section.keyPoint && <KeyPoint>{section.keyPoint}</KeyPoint>}
    </section>
  );
}
