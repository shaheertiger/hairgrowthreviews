import type { Metadata } from "next";
import { staticPages } from "@/lib/pages";
import { markdownMeta } from "@/lib/md/meta";
import GuideHub from "@/components/GuideHub";

const page = staticPages.aboutHairGrowth;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  ...markdownMeta(page.path, page.description),
};

export default function AboutHairGrowthIndex() {
  return (
    <GuideHub
      section="about-hair-growth"
      intro={page.intro}
    />
  );
}
