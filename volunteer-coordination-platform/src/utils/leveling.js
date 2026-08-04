const MAX_LEVEL = 50;

// XP required to advance from one level to the next
const BASE_XP_PER_LEVEL = 100;
const XP_INCREMENT_PER_LEVEL = 20;

// Title milestones

export const TITLE_BRACKETS = [
  { minLevel: 1, maxLevel: 5, title: "Newcomer" },
  { minLevel: 6, maxLevel: 10, title: "Helper" },
  { minLevel: 11, maxLevel: 15, title: "Kind Soul" },
  { minLevel: 16, maxLevel: 20, title: "Dedicated Supporter" },
  { minLevel: 21, maxLevel: 25, title: "Active Hand" },
  { minLevel: 26, maxLevel: 30, title: "Changemaker" },
  { minLevel: 31, maxLevel: 35, title: "Inspirer" },
  { minLevel: 36, maxLevel: 40, title: "Community Builder" },
  { minLevel: 41, maxLevel: 45, title: "Community Hero" },
  { minLevel: 46, maxLevel: 50, title: "Beacon" },
];

export const TITLE_ORDER = [
  "Newcomer",
  "Helper",
  "Kind Soul",
  "Dedicated Supporter",
  "Active Hand",
  "Changemaker",
  "Inspirer",
  "Community Builder",
  "Community Hero",
  "Beacon",
];

// Generate level brackets automatically

export const LEVEL_BRACKETS = (() => {
  const brackets = [];

  let cumulativeXp = 0;

  for (let level = 1; level <= MAX_LEVEL; level++) {
    brackets.push({
      level,
      minXp: cumulativeXp,
    });

    const xpNeededForNextLevel =
      BASE_XP_PER_LEVEL + (level - 1) * XP_INCREMENT_PER_LEVEL;

    cumulativeXp += xpNeededForNextLevel;
  }

  return brackets;
})();

// Helpers

export function getTitle(level) {
  const bracket = TITLE_BRACKETS.find(
    ({ minLevel, maxLevel }) =>
      level >= minLevel && level <= maxLevel
  );

  return bracket?.title ?? TITLE_BRACKETS[0].title;
}

export function hasRequiredTitle(volunteerTitle, requiredTitle) {
  if (!requiredTitle || requiredTitle === "any") return true;

  const volunteerRank = TITLE_ORDER.indexOf(volunteerTitle);
  const requiredRank = TITLE_ORDER.indexOf(requiredTitle);

  if (requiredRank === -1) return true;

  return volunteerRank >= requiredRank;
}

export function getLevelInfo(xp = 0) {
  const currentXp = Math.max(0, xp);

  // Find current level
  let currentBracket = LEVEL_BRACKETS[0];

  for (let i = LEVEL_BRACKETS.length - 1; i >= 0; i--) {
    if (currentXp >= LEVEL_BRACKETS[i].minXp) {
      currentBracket = LEVEL_BRACKETS[i];
      break;
    }
  }

  const isMaxLevel = currentBracket.level === MAX_LEVEL;

  const nextBracket = isMaxLevel
    ? null
    : LEVEL_BRACKETS[currentBracket.level];

  let progressPercentage = 100;
  let xpForNextLevel = 0;

  if (nextBracket) {
    const xpIntoCurrentLevel = currentXp - currentBracket.minXp;

    const xpNeededThisLevel =
      nextBracket.minXp - currentBracket.minXp;

    progressPercentage = Math.min(
      100,
      Math.floor((xpIntoCurrentLevel / xpNeededThisLevel) * 100)
    );

    xpForNextLevel = nextBracket.minXp - currentXp;
  }

  return {
    level: currentBracket.level,
    title: getTitle(currentBracket.level),

    minXp: currentBracket.minXp,

    nextLevelMinXp: nextBracket
      ? nextBracket.minXp
      : currentBracket.minXp,

    xpForNextLevel,

    progressPercentage,

    isMaxLevel,
  };
}