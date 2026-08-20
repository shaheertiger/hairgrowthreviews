import { ComparisonTableData } from "@/lib/types";

export default function ComparisonTable({
  data,
  firstColLabel = "",
  caption,
}: {
  data: ComparisonTableData;
  firstColLabel?: string;
  caption?: string;
}) {
  return (
    <figure className="my-7">
      <div className="overflow-hidden rounded-xl border border-border-subtle shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <thead>
              <tr className="bg-brand-700 text-white">
                <th scope="col" className="px-4 py-3.5 text-left font-bold">
                  {firstColLabel}
                </th>
                {data.columns.map((c) => (
                  <th key={c} scope="col" className="px-4 py-3.5 text-left font-bold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={`${i % 2 === 0 ? "bg-surface" : "bg-surface-muted"} border-t border-border-subtle`}
                >
                  <th scope="row" className="px-4 py-3.5 text-left align-top font-semibold text-stone-800">
                    {row.label}
                  </th>
                  {row.values.map((v, j) => (
                    <td key={j} className="px-4 py-3.5 align-top leading-relaxed text-stone-600">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <figcaption className="mt-2 text-xs text-stone-400 sm:hidden">Swipe the table to see more →</figcaption>
      {caption && <figcaption className="mt-2 text-xs text-stone-500">{caption}</figcaption>}
    </figure>
  );
}
