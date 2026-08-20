export default function ProsConsBox({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="my-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <p className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-brand-800">
          <span
            aria-hidden
            className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs text-white"
          >
            ✓
          </span>
          What We Liked
        </p>
        <ul className="space-y-2.5">
          {pros.map((p, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-stone-700">
              <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-red-800">
          <span
            aria-hidden
            className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white"
          >
            ✕
          </span>
          What We Didn&apos;t
        </p>
        <ul className="space-y-2.5">
          {cons.map((c, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-stone-700">
              <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
