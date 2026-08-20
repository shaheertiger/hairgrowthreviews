import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us & Editorial Process",
  description: "How HairGrowthReviews researches, rates, and reviews hair loss and hair growth products.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">About {site.name}</h1>
      <div className="prose-content mt-6">
        <p>
          {site.name} is an independent publisher of hair loss and hair regrowth product reviews. We started this
          site because most product pages in this category are written by the brands themselves — we wanted a
          place that researches ingredients, evidence, and real customer sentiment before publishing a verdict.
        </p>
        <h2 id="editorial-process">Our Editorial Process</h2>
        <p>For every product we review, our editorial team:</p>
        <ul>
          <li>Researches the manufacturer&apos;s stated ingredients, claims, and pricing directly from official sources</li>
          <li>Checks whether any clinical evidence exists for the ingredients and, separately, for the finished product itself — and we label the difference clearly</li>
          <li>Reviews publicly available customer sentiment across retailers and independent review platforms</li>
          <li>Flags manufacturer claims we could not independently verify, rather than repeating them as fact</li>
          <li>Updates reviews periodically as products, pricing, and evidence change</li>
        </ul>
        <h2>Affiliate Disclosure</h2>
        <p>{site.disclosure}</p>
        <h2>Medical Disclaimer</h2>
        <p>
          Nothing on this site is medical advice. Information about hair loss causes, treatments, and products is
          for educational purposes only. Consult a licensed dermatologist or physician before starting any new
          treatment, especially if you have an underlying medical condition or take other medications.
        </p>
      </div>
    </div>
  );
}
