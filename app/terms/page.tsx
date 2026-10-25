import type { Metadata } from "next";
import { staticPages } from "@/lib/pages";
import { markdownMeta } from "@/lib/md/meta";
import { site } from "@/lib/site";

const page = staticPages.terms;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  ...markdownMeta(page.path, page.description),
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">Terms of Use</h1>
      <div className="prose-content mt-6">
        <p>
          By using {site.domain}, you agree to the following terms. Content on this site is provided for
          general informational purposes only and does not constitute medical advice.
        </p>
        <h2>No Medical Advice</h2>
        <p>
          Reviews, guides, and other content on this site are not a substitute for professional medical advice,
          diagnosis, or treatment. Always consult a licensed physician or dermatologist before starting any hair
          loss treatment.
        </p>
        <h2>Affiliate Relationships</h2>
        <p>{site.disclosure}</p>
        <h2>Accuracy</h2>
        <p>
          We make a good-faith effort to keep product information, pricing, and claims accurate and current, but
          prices, formulas, and availability can change without notice. Verify current details directly with the
          retailer or manufacturer before purchasing.
        </p>
      </div>
    </div>
  );
}
