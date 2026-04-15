import { useState, useCallback, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import Game from './components/Game';
import SettingsModal from './components/SettingsModal';
import DailyReward from './components/DailyReward';
import StarfieldBackground from './components/StarfieldBackground';
import { useProgress } from './hooks/useProgress';
import { useSound } from './hooks/useSound';
import { useAdManager } from './components/AdPlaceholder';
import { COINS_CONFIG } from './utils/constants';

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
    coins,
    addCoins,
    spendCoins,
    dailyStreak,
    canClaimDailyReward,
    claimDailyReward,
  } = useProgress();

  const [screen, setScreen] = useState('home');
  const [gameLevel, setGameLevel] = useState(currentLevel);
  const [showSettings, setShowSettings] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);

  const playSound = useSound(settings.sound);
  const { shouldShowInterstitial, showInterstitial } = useAdManager(gameLevel);

  // Show daily reward popup on first load if available
  useEffect(() => {
    if (canClaimDailyReward()) {
      setTimeout(() => setShowDailyReward(true), 500);
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

      // Award coins
      const coinReward = COINS_CONFIG.LEVEL_COMPLETE_REWARD +
        (stars === 3 ? COINS_CONFIG.THREE_STAR_BONUS : stars === 2 ? COINS_CONFIG.TWO_STAR_BONUS : 0);
      addCoins(coinReward);

      const nextLevel = gameLevel + 1;
      if (nextLevel > currentLevel) {
        setCurrentLevel(nextLevel);
      }

      if (shouldShowInterstitial(gameLevel)) {
        await showInterstitial();
      }

      if (gameLevel % 3 === 0) {
        addHints(1);
      }

      setGameLevel(nextLevel);
    },
    [gameLevel, currentLevel, setLevelStars, setCurrentLevel, addTotalMoves, addCoins, shouldShowInterstitial, showInterstitial, addHints]
  );

  const handleSpendCoins = useCallback((amount) => {
    spendCoins(amount);
  }, [spendCoins]);

  return (
    <div className="h-full w-full relative">
      <StarfieldBackground />

      {screen === 'home' ? (
        <HomeScreen
          currentLevel={currentLevel}
          levelStars={levelStars}
          coins={coins}
          onPlay={handlePlay}
          onSelectLevel={handleSelectLevel}
          onSettings={() => setShowSettings(true)}
          onDailyReward={() => setShowDailyReward(true)}
          canClaimDaily={canClaimDailyReward()}
        />
      ) : (
        <Game
          level={gameLevel}
          settings={settings}
          hintsRemaining={hintsRemaining}
          coins={coins}
          onHome={() => setScreen('home')}
          onSettings={() => setShowSettings(true)}
          onLevelComplete={handleLevelComplete}
          onUseHint={useHint}
          onSpendCoins={handleSpendCoins}
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

      {showDailyReward && (
        <DailyReward
          streak={dailyStreak}
          onClaim={claimDailyReward}
          onClose={() => setShowDailyReward(false)}
        />
      )}
    </div>
  );
}

export default App;
