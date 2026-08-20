export default function ProsConsBox({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="my-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <p className="mb-3 flex items-center gap-2 font-bold text-brand-800">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs text-white">
            ✓
          </span>
          Pros
        </p>
        <ul className="space-y-2">
          {pros.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-stone-700">
              <span className="text-brand-600">+</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="mb-3 flex items-center gap-2 font-bold text-red-800">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            ✕
          </span>
          Cons
        </p>
        <ul className="space-y-2">
          {cons.map((c, i) => (
            <li key={i} className="flex gap-2 text-sm text-stone-700">
              <span className="text-red-500">−</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
