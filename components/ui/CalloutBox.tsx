import { ReactNode } from "react";

const variants = {
  info: "border-brand-200 bg-brand-50",
  warning: "border-amber-200 bg-amber-50",
  danger: "border-red-200 bg-red-50",
};

export default function CalloutBox({
  title,
  children,
  variant = "info",
}: {
  title?: string;
  children: ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <div className={`my-6 rounded-xl border-2 p-5 ${variants[variant]}`}>
      {title && <p className="mb-2 font-bold text-stone-900">{title}</p>}
      <div className="text-sm leading-relaxed text-stone-700">{children}</div>
    </div>
  );
}
