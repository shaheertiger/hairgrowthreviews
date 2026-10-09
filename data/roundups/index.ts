import { RoundupData } from "@/lib/types";
import { bestMinoxidilForMen } from "./best-minoxidil-for-men";
import { bestBeardGrowthOil } from "./best-beard-growth-oil";
import { bestEyelashGrowthSerum } from "./best-eyelash-growth-serum";
import { bestEyebrowGrowthSerum } from "./best-eyebrow-growth-serum";
import { bestScalpMassager } from "./best-scalp-massager";

export const roundupHubs: RoundupData["hub"][] = [
  "Hair Growth & Hair Loss",
  "Hair Care",
  "Men's Grooming",
  "Brows, Lashes & Beard",
];

export const roundups: RoundupData[] = [
  bestMinoxidilForMen,
  bestBeardGrowthOil,
  bestEyelashGrowthSerum,
  bestEyebrowGrowthSerum,
  bestScalpMassager,
];
