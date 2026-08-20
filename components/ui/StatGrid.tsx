import { QuickFact } from "@/lib/types";

export default function StatGrid({ facts }: { facts: QuickFact[] }) {
  return (
    <div className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {facts.map((f) => (
        <div key={f.label} className="rounded-xl border border-border-subtle bg-surface p-4 text-center">
          <p className="text-lg font-extrabold text-brand-700 sm:text-xl">{f.value}</p>
          <p className="mt-1 text-xs font-medium text-stone-500">{f.label}</p>
        </div>
      ))}
    </div>
  );
}
