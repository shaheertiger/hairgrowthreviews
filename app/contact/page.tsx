import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${site.name} editorial team.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-stone-900 sm:text-4xl">Contact Us</h1>
      <div className="prose-content mt-6">
        <p>
          Have a correction, a product suggestion, or a question about one of our reviews? We want to hear from
          you — accuracy matters more to us than any single review staying unchanged.
        </p>
        <p>
          Email us at <a href={`mailto:editorial@${site.domain}`}>editorial@{site.domain}</a> and we&apos;ll follow
          up as soon as we can.
        </p>
      </div>
    </div>
  );
}
