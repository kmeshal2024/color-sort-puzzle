import { useState, useCallback, useRef } from 'react';
import { AD_CONFIG } from '../utils/constants';

export function useAdManager(currentLevel) {
  const lastAdTime = useRef(0);

  const shouldShowInterstitial = useCallback((completedLevel) => {
    if (completedLevel <= AD_CONFIG.FIRST_AD_AFTER_LEVEL) return false;
    if (completedLevel % AD_CONFIG.INTERSTITIAL_EVERY_N_LEVELS !== 0) return false;
    const now = Date.now();
    if (now - lastAdTime.current < AD_CONFIG.MIN_AD_INTERVAL_MS) return false;
    return true;
  }, []);

  const showInterstitial = useCallback(() => {
    lastAdTime.current = Date.now();
    // In production, this would call AdMob SDK
    console.log('[Ad] Showing interstitial ad');
    return new Promise((resolve) => setTimeout(resolve, 100));
  }, []);

  const showRewarded = useCallback(() => {
    lastAdTime.current = Date.now();
    // In production, this would show a rewarded video ad
    console.log('[Ad] Showing rewarded ad');
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  }, []);

  return { shouldShowInterstitial, showInterstitial, showRewarded };
}

export default function AdPlaceholder({ type = 'banner' }) {
  if (type === 'banner') {
    return (
      <div className="w-full max-w-lg mx-auto h-12 bg-white/5 rounded-lg flex items-center justify-center text-white/20 text-xs">
        Ad Space
      </div>
    );
  }
  return null;
}
