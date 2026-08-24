import {
  Footprints,
  CheckCircle2,
  Heart,
  ListChecks,
  Star,
  Hand,
  Medal,
  BicepsFlexed,
  Crown,
  Gem,
  HelpCircle,
} from "lucide-react";

const ICON_MAP = {
  footprints: Footprints,
  "check-circle": CheckCircle2,
  heart: Heart,
  "list-checks": ListChecks,
  star: Star,
  hand: Hand,
  medal: Medal,
  biceps: BicepsFlexed,
  crown: Crown,
  gem: Gem,
};

/**
 * Maps an achievement's `icon` identifier (e.g. "trophy") to its lucide
 * component. Falls back to HelpCircle for anything unrecognized — a typo
 * in a future achievement's icon value shouldn't crash the page, just
 * show a generic icon.
 */
export function getAchievementIcon(iconId) {
  return ICON_MAP[iconId] ?? HelpCircle;
}