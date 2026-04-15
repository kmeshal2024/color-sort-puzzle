import { useState, useCallback } from 'react';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants';

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
      if (next.theme !== prev.theme) {
        document.body.className = next.theme === 'default' ? '' : `theme-${next.theme}`;
      }
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
  };
}
