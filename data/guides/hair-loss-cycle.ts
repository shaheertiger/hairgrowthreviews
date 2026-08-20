import { GuideData } from "@/lib/types";

export const hairLossCycle: GuideData = {
  slug: "hair-loss-cycle",
  section: "about-hair-growth",
  metaTitle: "The Hair Growth Cycle Explained: Anagen, Catagen, Telogen, Exogen",
  metaDescription:
    "Understand the four phases of the hair growth cycle, how long each lasts, and what disrupts the cycle to cause hair loss — explained simply.",
  h1: "The Hair Growth Cycle, Explained",
  dek: "Every strand on your head is on its own independent clock. Understanding the four phases explains why hair loss treatments take months to show results.",
  intro: [
    "Each hair follicle on your scalp cycles independently through four distinct phases, and understanding this cycle is the single most useful thing you can know before starting any hair-loss treatment — it's why nothing in this category works overnight.",
  ],
  quickFacts: [
    { label: "Anagen (Growth)", value: "2-8 years" },
    { label: "Catagen (Transition)", value: "2-4 weeks" },
    { label: "Telogen (Resting)", value: "2-4 months" },
    { label: "Daily Shedding", value: "50-100 hairs" },
  ],
  sections: [
    {
      id: "four-phases",
      heading: "The Four Phases",
      body: [
        "Anagen (growth phase) is by far the longest, typically lasting 2-8 years on the scalp, during which hair grows roughly 1-2 cm per month. About 85-90% of your scalp hairs are in anagen at any given moment — this is the phase treatments like minoxidil aim to extend.",
        "Catagen (transitional phase) is brief, lasting only about 2-4 weeks, during which the follicle shrinks and detaches from its blood supply. Only around 1% of hairs are in this phase at once.",
        "Telogen (resting phase) lasts roughly 2-4 months, with about 10-15% of hairs resting at any time. The hair isn't actively growing but hasn't fallen out yet.",
        "Exogen (shedding phase) is when the old resting hair is finally released — typically as a new anagen hair is already beginning to grow beneath it. Losing 50-100 hairs a day during this phase is completely normal, not a sign of a problem.",
      ],
    },
    {
      id: "what-disrupts-it",
      heading: "What Disrupts the Cycle",
      body: [
        "Most hair loss comes down to something disrupting this cycle's normal balance. In androgenetic alopecia (male/female pattern hair loss), dihydrotestosterone (DHT) progressively shortens the anagen phase and miniaturizes follicles over successive cycles, producing thinner, shorter hairs each time around.",
        "In telogen effluvium, physical or emotional stress — illness, surgery, childbirth, crash dieting, a high fever — pushes an abnormally large share of follicles into telogen simultaneously, causing diffuse shedding roughly 2-3 months later. Alopecia areata is an autoimmune process that attacks anagen follicles directly. Nutritional deficiencies (iron, zinc, vitamin D, protein), thyroid dysfunction, certain medications, and scalp conditions can also shift the normal anagen-to-telogen ratio.",
      ],
    },
    {
      id: "why-it-takes-months",
      heading: "Why Treatments Take Months to Work",
      body: [
        "Because each follicle cycles on its own independent timetable, a treatment can't meaningfully change what you see in the mirror until enough follicles have cycled through a meaningful portion of anagen under the new treatment. That's the biological reason nearly every real hair-loss treatment — minoxidil, finasteride, ketoconazole shampoo — asks for a 3-6 month minimum trial before judging results, and often longer for a full picture.",
      ],
    },
  ],
  faq: [
    {
      q: "Is it normal to lose 100 hairs a day?",
      a: "Yes — losing 50-100 hairs daily is a normal part of the exogen (shedding) phase of the healthy hair cycle, not a sign of a problem on its own.",
    },
    {
      q: "Why do hair loss treatments take months to work?",
      a: "Because each follicle progresses through its own multi-month-to-multi-year cycle, visible density changes require enough follicles to cycle through a meaningful portion of the growth (anagen) phase under a new treatment — commonly 3-6 months at minimum.",
    },
    {
      q: "What's the difference between telogen effluvium and pattern hair loss?",
      a: "Telogen effluvium is temporary, diffuse shedding triggered by stress, illness, or major life events, usually resolving on its own within months. Pattern hair loss (androgenetic alopecia) is a progressive, DHT-driven miniaturization of follicles that continues without treatment.",
    },
  ],
  bottomLine:
    "Hair grows and sheds on a multi-phase cycle that runs for years per follicle — which is exactly why no legitimate treatment shows results in days or weeks, and why consistency matters more than any single product.",
  relatedSlugs: ["stages-hair-loss", "hair-growth-encyclopedia"],
  relatedReviewSlugs: ["biotopic-premium-hair-regrowth-serum", "revivogen-scalp-therapy-formula"],
  updatedDate: "August 2026",
};
