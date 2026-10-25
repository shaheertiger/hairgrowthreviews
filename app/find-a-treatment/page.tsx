import type { Metadata } from "next";
import { staticPages } from "@/lib/pages";
import { markdownMeta } from "@/lib/md/meta";
import GuideHub from "@/components/GuideHub";

const page = staticPages.findATreatment;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  ...markdownMeta(page.path, page.description),
};

export default function FindATreatmentIndex() {
  return (
    <GuideHub
      section="find-a-treatment"
      intro={page.intro}
    />
  );
}
