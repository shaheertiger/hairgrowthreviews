import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { roundups } from "@/data/roundups";
import { questions } from "@/data/questions";
import RoundupTemplate from "@/components/templates/RoundupTemplate";
import QuestionTemplate from "@/components/templates/QuestionTemplate";
import { roundupJsonLd, questionJsonLd } from "@/lib/schema";

// Buyer's guides (/best-minoxidil-for-men) and question posts
// (/how-long-does-minoxidil-take-to-work) both live at the root, mirroring the
// URL shape that ranks on thehonestreviewers.com. Anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...roundups, ...questions].map((p) => ({ slug: p.slug }));
}

function getPage(slug: string) {
  const roundup = roundups.find((r) => r.slug === slug);
  if (roundup) return { kind: "roundup" as const, data: roundup };
  const question = questions.find((q) => q.slug === slug);
  if (question) return { kind: "question" as const, data: question };
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};
  const { data } = page;
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: `/${data.slug}` },
    openGraph: { title: data.metaTitle, description: data.metaDescription, type: "article" },
  };
}

export default async function RootSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  const jsonLd = page.kind === "roundup" ? roundupJsonLd(page.data) : questionJsonLd(page.data);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {page.kind === "roundup" ? <RoundupTemplate data={page.data} /> : <QuestionTemplate data={page.data} />}
    </>
  );
}
