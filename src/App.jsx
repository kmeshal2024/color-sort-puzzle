import { useState, useCallback, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import Game from './components/Game';
import SettingsModal from './components/SettingsModal';
import { useProgress } from './hooks/useProgress';
import { useSound } from './hooks/useSound';
import { useAdManager } from './components/AdPlaceholder';

function App() {
  const {
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
  } = useProgress();

  const [screen, setScreen] = useState('home'); // 'home' | 'game'
  const [gameLevel, setGameLevel] = useState(currentLevel);
  const [showSettings, setShowSettings] = useState(false);

  const playSound = useSound(settings.sound);
  const { shouldShowInterstitial, showInterstitial, showRewarded } = useAdManager(gameLevel);

  // Apply saved theme on mount
  useEffect(() => {
    if (settings.theme && settings.theme !== 'default') {
      document.body.className = `theme-${settings.theme}`;
    }
  }, []);

  const vibrate = useCallback(
    (pattern) => {
      if (settings.vibration && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    },
    [settings.vibration]
  );

  const handlePlay = useCallback(() => {
    setGameLevel(currentLevel);
    setScreen('game');
  }, [currentLevel]);

  const handleSelectLevel = useCallback((level) => {
    setGameLevel(level);
    setScreen('game');
  }, []);

  const handleLevelComplete = useCallback(
    async (moves) => {
      const par = Math.ceil(moves * 1.5);
      const stars = moves <= par ? 3 : moves <= par * 1.5 ? 2 : 1;

      setLevelStars(gameLevel, stars);
      addTotalMoves(moves);

      const nextLevel = gameLevel + 1;
      if (nextLevel > currentLevel) {
        setCurrentLevel(nextLevel);
      }

      // Maybe show interstitial
      if (shouldShowInterstitial(gameLevel)) {
        await showInterstitial();
      }

      // Free hint every 3 levels
      if (gameLevel % 3 === 0) {
        addHints(1);
      }

      setGameLevel(nextLevel);
    },
    [gameLevel, currentLevel, setLevelStars, setCurrentLevel, addTotalMoves, shouldShowInterstitial, showInterstitial, addHints]
  );

  const handleShowRewardedAd = useCallback(async () => {
    const rewarded = await showRewarded();
    if (rewarded) {
      addHints(3);
    }
  }, [showRewarded, addHints]);

  return (
    <div className="h-full w-full">
      {screen === 'home' ? (
        <HomeScreen
          currentLevel={currentLevel}
          levelStars={levelStars}
          onPlay={handlePlay}
          onSelectLevel={handleSelectLevel}
          onSettings={() => setShowSettings(true)}
        />
      ) : (
        <Game
          level={gameLevel}
          settings={settings}
          hintsRemaining={hintsRemaining}
          onHome={() => setScreen('home')}
          onSettings={() => setShowSettings(true)}
          onLevelComplete={handleLevelComplete}
          onUseHint={useHint}
          onShowRewardedAd={handleShowRewardedAd}
          playSound={playSound}
          vibrate={vibrate}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          currentLevel={currentLevel}
          onUpdate={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
