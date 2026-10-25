import type { Metadata } from "next";
import { staticPages } from "@/lib/pages";
import { markdownMeta } from "@/lib/md/meta";
import { site } from "@/lib/site";

const page = staticPages.contact;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  ...markdownMeta(page.path, page.description),
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
          Email us at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> and we&apos;ll follow
          up as soon as we can.
        </p>
      </div>
    </div>
  );
}
