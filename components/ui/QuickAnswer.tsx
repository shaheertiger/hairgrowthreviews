/**
 * The page's direct answer, right under the H1 — the block featured snippets
 * and AI Overviews quote. Plain server-rendered text, never collapsed.
 */
export default function QuickAnswer({ text }: { text: string }) {
  return (
    <div
      id="quick-answer"
      className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/60 p-5 sm:p-6"
    >
      <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Quick answer</p>
      <p className="mt-2 text-[1.05rem] font-medium leading-relaxed text-stone-800">{text}</p>
    </div>
  );
}
