import { useState, useCallback } from 'react';
import { STORAGE_KEYS, DEFAULT_SETTINGS, COINS_CONFIG } from '../utils/constants';

function loadJSON(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function loadNumber(key, fallback) {
  const val = localStorage.getItem(key);
  return val !== null ? Number(val) : fallback;
}

function loadString(key, fallback) {
  return localStorage.getItem(key) || fallback;
}

export function useProgress() {
  const [currentLevel, setCurrentLevelState] = useState(
    () => loadNumber(STORAGE_KEYS.CURRENT_LEVEL, 1)
  );
  const [levelStars, setLevelStarsState] = useState(
    () => loadJSON(STORAGE_KEYS.LEVEL_STARS, {})
  );
  const [settings, setSettingsState] = useState(
    () => loadJSON(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );
  const [hintsRemaining, setHintsRemainingState] = useState(
    () => loadNumber(STORAGE_KEYS.HINTS_REMAINING, 3)
  );
  const [coins, setCoinsState] = useState(
    () => loadNumber(STORAGE_KEYS.COINS, COINS_CONFIG.STARTING_COINS)
  );
  const [dailyStreak, setDailyStreakState] = useState(
    () => loadNumber(STORAGE_KEYS.DAILY_REWARD_STREAK, 0)
  );

  const setCurrentLevel = useCallback((level) => {
    setCurrentLevelState(level);
    localStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, String(level));
  }, []);

  const setLevelStars = useCallback((level, stars) => {
    setLevelStarsState((prev) => {
      const existing = prev[String(level)] || 0;
      if (stars <= existing) return prev;
      const next = { ...prev, [String(level)]: stars };
      localStorage.setItem(STORAGE_KEYS.LEVEL_STARS, JSON.stringify(next));
      return next;
    });
  }, []);

  const setSettings = useCallback((update) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...update };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(next));
      return next;
    });
  }, []);

  const useHint = useCallback(() => {
    setHintsRemainingState((prev) => {
      const next = Math.max(0, prev - 1);
      localStorage.setItem(STORAGE_KEYS.HINTS_REMAINING, String(next));
      return next;
    });
  }, []);

  const addHints = useCallback((count) => {
    setHintsRemainingState((prev) => {
      const next = prev + count;
      localStorage.setItem(STORAGE_KEYS.HINTS_REMAINING, String(next));
      return next;
    });
  }, []);

  const addCoins = useCallback((amount) => {
    setCoinsState((prev) => {
      const next = Math.max(0, prev + amount);
      localStorage.setItem(STORAGE_KEYS.COINS, String(next));
      return next;
    });
  }, []);

  const spendCoins = useCallback((amount) => {
    let success = false;
    setCoinsState((prev) => {
      if (prev < amount) return prev;
      success = true;
      const next = prev - amount;
      localStorage.setItem(STORAGE_KEYS.COINS, String(next));
      return next;
    });
    return success;
  }, []);

  const canClaimDailyReward = useCallback(() => {
    const lastDate = loadString(STORAGE_KEYS.DAILY_REWARD_DATE, '');
    const today = new Date().toISOString().slice(0, 10);
    return lastDate !== today;
  }, []);

  const claimDailyReward = useCallback(() => {
    const lastDate = loadString(STORAGE_KEYS.DAILY_REWARD_DATE, '');
    const today = new Date().toISOString().slice(0, 10);
    if (lastDate === today) return 0;

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    let newStreak = lastDate === yesterday ? dailyStreak + 1 : 1;
    if (newStreak > 7) newStreak = 1;

    const rewardIndex = Math.min(newStreak - 1, COINS_CONFIG.DAILY_REWARDS.length - 1);
    const reward = COINS_CONFIG.DAILY_REWARDS[rewardIndex];

    localStorage.setItem(STORAGE_KEYS.DAILY_REWARD_DATE, today);
    localStorage.setItem(STORAGE_KEYS.DAILY_REWARD_STREAK, String(newStreak));
    setDailyStreakState(newStreak);
    addCoins(reward);

    return reward;
  }, [dailyStreak, addCoins]);

  const addTotalMoves = useCallback((count) => {
    const current = loadNumber(STORAGE_KEYS.TOTAL_MOVES, 0);
    localStorage.setItem(STORAGE_KEYS.TOTAL_MOVES, String(current + count));
  }, []);

  return {
    currentLevel,
    setCurrentLevel,
    levelStars,
    setLevelStars,
    settings,
    setSettings,
    hintsRemaining,
    useHint,
    addHints,
    addTotalMoves,
    coins,
    addCoins,
    spendCoins,
    dailyStreak,
    canClaimDailyReward,
    claimDailyReward,
  };
}
