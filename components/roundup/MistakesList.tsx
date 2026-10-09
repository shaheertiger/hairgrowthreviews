import { RoundupMistake } from "@/lib/types";

export default function MistakesList({ items }: { items: RoundupMistake[] }) {
  return (
    <div className="my-6 space-y-4">
      {items.map((m) => (
        <div key={m.heading} className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-bold text-red-900">{m.heading}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-700">{m.body}</p>
        </div>
      ))}
    </div>
  );
}
