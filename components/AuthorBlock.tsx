import { scientificReviewer } from "@/lib/reviewer";

export default function AuthorBlock({ updatedDate }: { updatedDate: string }) {
  return (
    <div className="flex items-start gap-3 text-sm text-stone-500">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
        HG
      </span>
      <div>
        <p className="font-semibold text-stone-800">
          Written by HairGrowthReviews Editorial Team
        </p>
        <p>
          Reviewed by{" "}
          <a
            href={scientificReviewer.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-700 underline hover:text-brand-800"
          >
            {scientificReviewer.name}
          </a>
          , {scientificReviewer.title}
        </p>
        <p className="mt-0.5">
          Updated {updatedDate} · Independently researched ·{" "}
          <a href="/about#editorial-process" className="underline hover:text-brand-700">
            How we review
          </a>
        </p>
      </div>
    </div>
  );
}
