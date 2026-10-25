import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guides } from "@/data/guides";
import GuideTemplate from "@/components/templates/GuideTemplate";
import { guideJsonLd } from "@/lib/schema";
import { markdownMeta } from "@/lib/md/meta";

function getGuide() {
  return guides.find((g) => g.section === "the-hgr-regimen" && g.slug === "the-hgr-regimen");
}

export async function generateMetadata(): Promise<Metadata> {
  const data = getGuide();
  if (!data) return {};
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    ...markdownMeta("/the-hgr-regimen", data.metaDescription),
  };
}

export default function HgrRegimenPage() {
  const data = getGuide();
  if (!data) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd(data, "/the-hgr-regimen")) }}
      />
      <GuideTemplate data={data} />
    </>
  );
}
