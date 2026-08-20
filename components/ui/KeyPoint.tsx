export default function KeyPoint({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-7 flex gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
      <span
        aria-hidden
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-black text-white"
      >
        !
      </span>
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-700">Key Point</p>
        <p className="text-[0.95rem] leading-relaxed text-stone-800">{children}</p>
      </div>
    </aside>
  );
}
