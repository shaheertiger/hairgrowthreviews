export default function AuthorBlock({ updatedDate }: { updatedDate: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-stone-500">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
        HG
      </span>
      <div>
        <p className="font-semibold text-stone-800">HairGrowthReviews Editorial Team</p>
        <p>
          Updated {updatedDate} · Independently researched ·{" "}
          <a href="/about#editorial-process" className="underline hover:text-brand-700">
            How we review
          </a>
        </p>
      </div>
    </div>
  );
}
