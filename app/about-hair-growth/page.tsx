import type { Metadata } from "next";
import GuideHub from "@/components/GuideHub";

export const metadata: Metadata = {
  title: "About Hair Growth: The Hair Cycle, Stages of Hair Loss & More",
  description:
    "How hair grows and why it falls out — the hair growth cycle, the stages of male and female pattern hair loss, and an A–Z encyclopedia of hair growth terms.",
  alternates: { canonical: "/about-hair-growth" },
};

export default function AboutHairGrowthIndex() {
  return (
    <GuideHub
      section="about-hair-growth"
      intro="The science behind hair growth and hair loss, explained plainly — start here before you buy a treatment."
    />
  );
}
