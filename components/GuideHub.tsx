import Link from "next/link";
import { guides } from "@/data/guides";
import type { GuideData } from "@/lib/types";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { RoundupCards } from "@/components/RelatedLinks";
import { guideHref, guideSectionLabels, roundupsForGuideSection } from "@/lib/links";

/** Index page for a guide section (/find-a-treatment, /about-hair-growth). */
export default function GuideHub({ section, intro }: { section: GuideData["section"]; intro: string }) {
  const items = guides.filter((g) => g.section === section);
  const label = guideSectionLabels[section];
  const roundupsHere = roundupsForGuideSection(section);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label }]} />
      <h1 className="mt-4 text-[1.75rem] font-extrabold leading-tight text-stone-900 sm:text-4xl">{label}</h1>
      <p className="mt-3 max-w-2xl text-base text-stone-600 sm:text-lg">{intro}</p>
      <ul className="mt-8 divide-y divide-border-subtle rounded-xl border border-border-subtle bg-surface">
        {items.map((g) => (
          <li key={g.slug}>
            <Link href={guideHref(g)} className="block px-4 py-4 hover:bg-brand-50">
              <p className="font-bold text-stone-900">{g.h1}</p>
              <p className="mt-1 line-clamp-2 text-sm text-stone-500">{g.dek}</p>
            </Link>
          </li>
        ))}
      </ul>
      <RoundupCards items={roundupsHere} heading="Related Buyer's Guides" />
    </div>
  );
}
