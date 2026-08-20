import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guides } from "@/data/guides";
import GuideTemplate from "@/components/templates/GuideTemplate";
import { guideJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return guides.filter((g) => g.section === "about-hair-growth").map((g) => ({ slug: g.slug }));
}

function getGuide(slug: string) {
  return guides.find((g) => g.section === "about-hair-growth" && g.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getGuide(slug);
  if (!data) return {};
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: `/about-hair-growth/${data.slug}` },
  };
}

export default async function AboutHairGrowthPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getGuide(slug);
  if (!data) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd(data, `/about-hair-growth/${data.slug}`)) }}
      />
      <GuideTemplate data={data} />
    </>
  );
}
