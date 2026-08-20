import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { reviews } from "@/data/reviews";
import ReviewTemplate from "@/components/templates/ReviewTemplate";
import { reviewJsonLd } from "@/lib/schema";

function getReview() {
  return reviews.find((r) => r.slug === "mane-n-tail-shampoo");
}

export async function generateMetadata(): Promise<Metadata> {
  const data = getReview();
  if (!data) return {};
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: "/mane-n-tail-shampoo-read-first" },
  };
}

export default function ManeNTailPage() {
  const data = getReview();
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
