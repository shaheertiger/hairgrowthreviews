import { useId } from "react";

function Star({ fill, id }: { fill: number; id: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" className="inline-block">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={20 * fill} height="20" />
        </clipPath>
      </defs>
      <path
        d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L10 1.5z"
        fill="#e7e5e4"
      />
      <g clipPath={`url(#${id})`}>
        <path
          d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L10 1.5z"
          fill="#f59e0b"
        />
      </g>
    </svg>
  );
}

export default function RatingBadge({
  rating,
  reviewCount,
  size = "md",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
}) {
  const stars = Array.from({ length: 5 }, (_, i) => Math.max(0, Math.min(1, rating - i)));
  const uid = useId();
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {stars.map((fill, i) => (
          <Star key={i} fill={fill} id={`star-clip-${uid}-${i}`} />
        ))}
      </div>
      <span className={size === "lg" ? "text-lg font-bold text-stone-900" : "text-sm font-bold text-stone-900"}>
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className="text-sm text-stone-500">({reviewCount.toLocaleString()} reviews)</span>
      )}
    </div>
  );
}
