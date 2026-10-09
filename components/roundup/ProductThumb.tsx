import { amazonImage } from "@/lib/affiliate";

/** Small Amazon listing image, or nothing if the last sync captured none. */
export default function ProductThumb({ asin, alt, size }: { asin?: string; alt: string; size: number }) {
  const src = amazonImage(asin);
  if (!src) return null;
  return (
    // Amazon-hosted listing image; served as-is per the Associates terms.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size }}
      className="shrink-0 rounded-lg bg-white object-contain p-1 ring-1 ring-border-subtle"
    />
  );
}
