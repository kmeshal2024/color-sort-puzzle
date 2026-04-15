export const MAX_BALLS_PER_TUBE = 4;
export const EMPTY_TUBES_COUNT = 2;

export const DIFFICULTY = {
  EASY:   { minLevel: 1,   maxLevel: 30,  colors: 4,  tubes: 6  },
  MEDIUM: { minLevel: 31,  maxLevel: 80,  colors: 6,  tubes: 8  },
  HARD:   { minLevel: 81,  maxLevel: 150, colors: 8,  tubes: 10 },
  EXPERT: { minLevel: 151, maxLevel: Infinity, colors: 10, tubes: 12 },
};

export const STORAGE_KEYS = {
  CURRENT_LEVEL: 'colorSortPuzzle_currentLevel',
  LEVEL_STARS: 'colorSortPuzzle_levelStars',
  SETTINGS: 'colorSortPuzzle_settings',
  TOTAL_MOVES: 'colorSortPuzzle_totalMoves',
  HINTS_REMAINING: 'colorSortPuzzle_hintsRemaining',
};

export const DEFAULT_SETTINGS = {
  sound: true,
  vibration: true,
  theme: 'default',
};

export const THEMES = [
  { id: 'default', name: 'Default', unlockLevel: 0 },
  { id: 'ocean', name: 'Ocean', unlockLevel: 25 },
  { id: 'forest', name: 'Forest', unlockLevel: 50 },
  { id: 'sunset', name: 'Sunset', unlockLevel: 75 },
];

export const AD_CONFIG = {
  FIRST_AD_AFTER_LEVEL: 5,
  INTERSTITIAL_EVERY_N_LEVELS: 3,
  MIN_AD_INTERVAL_MS: 60000,
};
