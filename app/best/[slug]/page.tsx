import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buyingGuides } from "@/data/buying-guides";
import BuyingGuideTemplate from "@/components/templates/BuyingGuideTemplate";
import { buyingGuideJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return buyingGuides.map((g) => ({ slug: g.slug }));
}

function getGuide(slug: string) {
  return buyingGuides.find((g) => g.slug === slug);
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
    alternates: { canonical: `/best/${data.slug}` },
  };
}

export default async function BuyingGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getGuide(slug);
  if (!data) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buyingGuideJsonLd(data)) }}
      />
      <BuyingGuideTemplate data={data} />
    </>
  );
}
