import Link from "next/link";
import { reviews } from "@/data/reviews";
import RatingBadge from "./ui/RatingBadge";

export default function RelatedReviews({ slugs }: { slugs: string[] }) {
  const items = slugs.map((s) => reviews.find((r) => r.slug === s)).filter((r): r is NonNullable<typeof r> => !!r);
  if (items.length === 0) return null;
  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl font-bold text-brand-900">Related Reviews</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/reviews/${item.slug}`}
            className="rounded-xl border border-border-subtle bg-surface p-4 transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{item.category}</p>
            <p className="mt-1 font-bold text-stone-900">{item.productName}</p>
            <div className="mt-2">
              <RatingBadge rating={item.rating} size="sm" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
