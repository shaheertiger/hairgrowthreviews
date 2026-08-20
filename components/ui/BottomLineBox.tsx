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
    <div className="my-10 overflow-hidden rounded-2xl border-2 border-brand-600 bg-gradient-to-br from-brand-50 to-surface">
      <div className="bg-brand-600 px-6 py-2.5">
        <p className="text-xs font-black uppercase tracking-wide text-white">The Bottom Line</p>
      </div>
      <div className="p-6 sm:p-7">
        <p className="text-lg font-medium leading-relaxed text-stone-800">{text}</p>
        {ctaLabel && ctaHref && (
          <div className="mt-6">
            <CTAButton href={ctaHref} label={ctaLabel} />
          </div>
        )}
      </div>
    </div>
  );
}
