import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { roundups } from "@/data/roundups";
import RoundupTemplate from "@/components/templates/RoundupTemplate";
import { roundupJsonLd } from "@/lib/schema";

// Roundups live at the root (/best-minoxidil-for-men), mirroring the URL shape
// that ranks on thehonestreviewers.com. Anything not in the list is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return roundups.map((r) => ({ slug: r.slug }));
}

function getRoundup(slug: string) {
  return roundups.find((r) => r.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getRoundup(slug);
  if (!data) return {};
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: `/${data.slug}` },
    openGraph: { title: data.metaTitle, description: data.metaDescription, type: "article" },
  };
}

export default async function RoundupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getRoundup(slug);
  if (!data) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roundupJsonLd(data)) }}
      />
      <RoundupTemplate data={data} />
    </>
  );
}
