import CTAButton from "./CTAButton";

export default function BottomLineBox({
  text,
  ctaLabel,
  ctaHref,
}: {
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="my-8 rounded-2xl border-2 border-brand-600 bg-brand-50 p-6 sm:p-8">
      <p className="mb-1 text-xs font-black uppercase tracking-wide text-brand-700">The Bottom Line</p>
      <p className="text-base font-medium leading-relaxed text-stone-800">{text}</p>
      {ctaLabel && ctaHref && (
        <div className="mt-5">
          <CTAButton href={ctaHref} label={ctaLabel} />
        </div>
      )}
    </div>
  );
}
