import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { questionHref, reviewHref, roundupHref, type ClusterRouting as Routing } from "@/lib/links";

const KEEP_CASE = new Set(["Dyson", "Airwrap", "Supersonic", "Black", "Friday"]);
/** "Best Hair Dryer for Men" -> "best hair dryer for men", keeping acronyms (DHT, 4C) and brands. */
const sentenceCase = (crumb: string) =>
  crumb
    .split(" ")
    .map((w) => (KEEP_CASE.has(w) || /^[A-Z0-9]{2,}$/.test(w) ? w : w.toLowerCase()))
    .join(" ");

/** "a, b and c" with each item rendered as a link. */
function joined(items: { href: string; label: string }[]): ReactNode {
  return items.map((it, i) => (
    <Fragment key={it.href}>
      {i > 0 && (i === items.length - 1 ? " and " : ", ")}
      <Link href={it.href}>{it.label}</Link>
    </Fragment>
  ));
}

/**
 * The routing paragraph that closes a roundup's overview: sibling buyer's
 * guides, the questions this guide's readers ask next, and products we have
 * reviewed in depth. Mirrors the hand-written routing in the site's
 * best-performing intros so every roundup carries in-text cluster links.
 */
export default function ClusterRouting({ routing }: { routing: Routing }) {
  const { roundups, questions, reviews } = routing;
  if (!roundups.length && !questions.length && !reviews.length) return null;
  return (
    <p>
      {roundups.length > 0 && (
        <>
          Still comparing? We also rank the{" "}
          {joined(roundups.map((r) => ({ href: roundupHref(r.slug), label: sentenceCase(r.crumb) })))}.{" "}
        </>
      )}
      {questions.length > 0 && (
        <>
          Readers of this guide often ask next: {joined(questions.map((q) => ({ href: questionHref(q.slug), label: q.h1.split(":")[0].replace(/\?$/, "") })))}.{" "}
        </>
      )}
      {reviews.length > 0 && (
        <>
          For a closer look at single products, read our full {joined(reviews.map((v) => ({ href: reviewHref(v.slug), label: v.productName })))}{" "}
          {reviews.length > 1 ? "reviews" : "review"}.
        </>
      )}
    </p>
  );
}
