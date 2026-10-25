import type { Metadata } from "next";
import { staticPages } from "@/lib/pages";
import { markdownMeta } from "@/lib/md/meta";
import Link from "next/link";
import { questions } from "@/data/questions";
import { roundupHubs } from "@/data/roundups";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

const page = staticPages.answers;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  ...markdownMeta(page.path, page.aiSummary),
};

export default function AnswersIndexPage() {
  const hubs = roundupHubs.filter((hub) => questions.some((q) => q.hub === hub));
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Hair Answers" }]} />
      <h1 className="mt-4 text-[1.75rem] font-extrabold leading-tight text-stone-900 sm:text-4xl">Hair Answers</h1>
      <p className="mt-3 max-w-2xl text-base text-stone-600 sm:text-lg">
        Short, evidence-based answers to the questions people actually ask about hair loss and hair care — then the
        detail, if you want it.
      </p>
      {hubs.map((hub) => (
        <section key={hub} className="mt-10">
          <h2 className="text-xl font-extrabold text-stone-900 sm:text-2xl">{hub}</h2>
          <ul className="mt-4 divide-y divide-border-subtle rounded-xl border border-border-subtle bg-surface">
            {questions
              .filter((q) => q.hub === hub)
              .map((q) => (
                <li key={q.slug}>
                  <Link href={`/${q.slug}`} className="block px-4 py-3.5 hover:bg-brand-50">
                    <p className="font-bold text-stone-900">{q.h1}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-stone-500">{q.shortAnswer}</p>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
