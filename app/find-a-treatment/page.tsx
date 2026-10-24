import type { Metadata } from "next";
import GuideHub from "@/components/GuideHub";

export const metadata: Metadata = {
  title: "Find a Hair Loss Treatment: Minoxidil, Supplements & Surgery",
  description:
    "Evidence-based guides to the main hair loss treatments — minoxidil (Rogaine), hair growth supplements and scalp reduction surgery — and who each one suits.",
  alternates: { canonical: "/find-a-treatment" },
};

export default function FindATreatmentIndex() {
  return (
    <GuideHub
      section="find-a-treatment"
      intro="What each major hair loss treatment does, what the evidence says, and who it suits — from topical minoxidil to supplements and surgery."
    />
  );
}
