import { ComparisonTableData } from "@/lib/types";

export default function ComparisonTable({ data, firstColLabel = "" }: { data: ComparisonTableData; firstColLabel?: string }) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border-subtle">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="bg-brand-700 text-white">
            <th className="px-4 py-3 text-left font-bold">{firstColLabel}</th>
            {data.columns.map((c) => (
              <th key={c} className="px-4 py-3 text-left font-bold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted"}>
              <td className="px-4 py-3 font-semibold text-stone-800">{row.label}</td>
              {row.values.map((v, j) => (
                <td key={j} className="px-4 py-3 text-stone-600">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
