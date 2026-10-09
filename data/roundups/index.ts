import { RoundupData } from "@/lib/types";
import { bestMinoxidilForMen } from "./best-minoxidil-for-men";
import { bestBeardGrowthOil } from "./best-beard-growth-oil";
import { bestEyelashGrowthSerum } from "./best-eyelash-growth-serum";
import { bestEyebrowGrowthSerum } from "./best-eyebrow-growth-serum";
import { bestScalpMassager } from "./best-scalp-massager";
import { bestHairGrowthProductsForMen } from "./best-hair-growth-products-for-men";
import { bestHairGrowthProductsForWomen } from "./best-hair-growth-products-for-women";
import { bestHairProductsForMen } from "./best-hair-products-for-men";
import { bestShampooForMen } from "./best-shampoo-for-men";
import { bestConditionerForThinningHair } from "./best-conditioner-for-thinning-hair";

export const roundupHubs: RoundupData["hub"][] = [
  "Hair Growth & Hair Loss",
  "Hair Care",
  "Men's Grooming",
  "Brows, Lashes & Beard",
  bestHairGrowthProductsForMen,
  bestHairGrowthProductsForWomen,
  bestHairProductsForMen,
  bestShampooForMen,
  bestConditionerForThinningHair,
];

export const roundups: RoundupData[] = [
  bestMinoxidilForMen,
  bestBeardGrowthOil,
  bestEyelashGrowthSerum,
  bestEyebrowGrowthSerum,
  bestScalpMassager,
  bestHairGrowthProductsForMen,
  bestHairGrowthProductsForWomen,
  bestHairProductsForMen,
  bestShampooForMen,
  bestConditionerForThinningHair,
];
