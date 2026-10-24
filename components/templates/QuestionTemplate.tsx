import Link from "next/link";
import { QuestionData, RoundupData } from "@/lib/types";
import { amazonImage, amazonProductLink } from "@/lib/affiliate";
import { roundups } from "@/data/roundups";
import { questionHref, relatedQuestionsFor, relatedRoundupsForQuestion } from "@/lib/links";
import { createLinker } from "@/lib/autolink";
import { GuideLinks, QuestionList, RoundupCards } from "@/components/RelatedLinks";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AuthorBlock from "@/components/AuthorBlock";
import TableOfContents from "@/components/ui/TableOfContents";
import StickyToc from "@/components/ui/StickyToc";
import ReadingProgress from "@/components/ui/ReadingProgress";
import KeyTakeaways from "@/components/ui/KeyTakeaways";
import ArticleSection from "@/components/ui/ArticleSection";
import FAQAccordion from "@/components/ui/FAQAccordion";
import BottomLineBox from "@/components/ui/BottomLineBox";
import PillarPicks from "@/components/roundup/PillarPicks";
import StickyBuyBar from "@/components/roundup/StickyBuyBar";
import ProductThumb from "@/components/roundup/ProductThumb";

export default function QuestionTemplate({ data }: { data: QuestionData }) {
  const pillar = roundups.find((r) => r.slug === data.pillarSlug) as RoundupData;
  const top = pillar.products[0];
  const relatedQs = relatedQuestionsFor(data);
  const relatedRs = relatedRoundupsForQuestion(data);
  const linkify = createLinker(questionHref(data.slug), ["/answers"]);

  // Split the body so the reader meets the buyer's guide again mid-article.
  const mid = Math.ceil(data.sections.length / 2);

  const tocItems = [
    { id: "short-answer", label: "The Short Answer" },
    ...data.sections.map((s) => ({ id: s.id, label: s.heading })),
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "bottom-line", label: "The Bottom Line" },
  ];

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:py-10 md:pb-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Hair Answers", href: "/answers" },
            { label: data.crumb },
          ]}
        />

        <header className="mt-5 max-w-3xl">
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
            {data.hub}
          </span>
          <h1 className="mt-4 text-[1.75rem] font-extrabold leading-tight tracking-tight text-stone-900 sm:text-[2.6rem] sm:leading-[1.15]">
            {data.h1}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-stone-600 sm:mt-4 sm:text-xl">{data.dek}</p>
        </header>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
          <article className="min-w-0 max-w-3xl">
            <section
              id="short-answer"
              className="mt-6 scroll-mt-24 rounded-2xl border-2 border-brand-600 bg-gradient-to-br from-brand-50 to-surface p-5 sm:p-6"
            >
              <p className="text-xs font-black uppercase tracking-wide text-brand-700">The Short Answer</p>
              <p className="mt-2 text-lg font-medium leading-relaxed text-stone-900">{data.shortAnswer}</p>
            </section>

            <PillarPicks pillar={pillar} />

            <div className="border-y border-border-subtle py-4">
              <AuthorBlock updatedDate={data.updatedDate} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-stone-400">
              We may earn a commission when you buy through our links, at no cost to you. As an Amazon Associate we
              earn from qualifying purchases.{" "}
              <Link href="/about#editorial-process" className="underline hover:text-brand-700">
                How we research
              </Link>
            </p>

            <KeyTakeaways items={data.keyTakeaways} />

            <div className="lg:hidden">
              <TableOfContents items={tocItems} />
            </div>

            <section className="prose-content mt-10">
              {data.intro.map((p, i) => (
                <p key={i} className={i === 0 ? "lead" : undefined}>
                  {linkify(p)}
                </p>
              ))}
            </section>

            <div className="mt-10 space-y-10">
              {data.sections.slice(0, mid).map((section, i) => (
                <ArticleSection key={section.id} section={section} index={i + 1} linkify={linkify} />
              ))}
            </div>

            <div className="my-10 flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-muted p-5 sm:flex-row sm:items-center">
              <ProductThumb asin={top.asin} alt={top.name} size={72} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-wide text-accent-600">
                  Our #1 pick for {pillar.crumb.replace(/^Best /, "").toLowerCase()}
                </p>
                <p className="mt-1 font-bold text-stone-900">{top.name}</p>
                <p className="mt-1 text-sm text-stone-600">{top.bottomLine}</p>
              </div>
              <a
                href={amazonProductLink(top.name, top.asin)}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="shrink-0 rounded-xl bg-accent-500 px-5 py-3 text-center text-sm font-black uppercase tracking-wide text-white hover:bg-accent-600"
              >
                Check Price
              </a>
            </div>

            <div className="space-y-10">
              {data.sections.slice(mid).map((section, i) => (
                <ArticleSection key={section.id} section={section} index={mid + i + 1} linkify={linkify} />
              ))}
            </div>

            <section id="faq" className="prose-content mt-10 scroll-mt-24 border-t border-border-subtle pt-10">
              <h2>Frequently Asked Questions</h2>
              <FAQAccordion items={data.faq} />
            </section>

            <section id="bottom-line" className="scroll-mt-24">
              <BottomLineBox
                text={data.bottomLine}
                ctaLabel={`See Our ${pillar.crumb} Picks →`}
                ctaHref={`/${pillar.slug}`}
              />
            </section>

            <QuestionList items={relatedQs} heading="Related Questions" />
            <RoundupCards items={relatedRs} heading="Buyer's Guides" />
            <GuideLinks items={data.relatedGuides ?? []} heading="Learn More" />
          </article>

          <aside className="hidden lg:block">
            <StickyToc items={tocItems}>
              <div className="mb-6 rounded-xl border-2 border-accent-500 bg-surface p-3">
                <p className="text-[0.65rem] font-black uppercase tracking-wide text-accent-600">Our #1 Pick</p>
                <div className="mt-2 flex items-center gap-2.5">
                  <ProductThumb asin={top.asin} alt={top.name} size={48} />
                  <p className="line-clamp-3 text-xs font-bold leading-snug text-stone-900">{top.name}</p>
                </div>
                <a
                  href={amazonProductLink(top.name, top.asin)}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="mt-3 block rounded-lg bg-accent-500 py-2 text-center text-xs font-black uppercase tracking-wide text-white hover:bg-accent-600"
                >
                  Check Price
                </a>
              </div>
            </StickyToc>
          </aside>
        </div>
      </div>
      <StickyBuyBar name={top.name} href={amazonProductLink(top.name, top.asin)} image={amazonImage(top.asin)} />
    </>
  );
}
