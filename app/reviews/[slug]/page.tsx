import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { reviews } from "@/data/reviews";
import ReviewTemplate from "@/components/templates/ReviewTemplate";
import { reviewJsonLd } from "@/lib/schema";
import { markdownMeta } from "@/lib/md/meta";

export function generateStaticParams() {
  return reviews.map((r) => ({ slug: r.slug }));
}

function getReview(slug: string) {
  return reviews.find((r) => r.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getReview(slug);
  if (!data) return {};
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    ...markdownMeta(`/reviews/${data.slug}`, data.metaDescription),
    openGraph: { title: data.metaTitle, description: data.metaDescription, type: "article" },
  };
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getReview(slug);
  if (!data) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd(data)) }}
      />
      <ReviewTemplate data={data} />
    </>
  );
}
