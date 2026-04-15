import { useState } from 'react';
import Ball from './Ball';

function LevelSelect({ currentLevel, levelStars, onSelectLevel, onBack }) {
  const maxLevel = Math.max(currentLevel, 1);
  const totalDisplay = Math.ceil(maxLevel / 10) * 10 + 10;

  return (
    <div className="flex flex-col h-full relative z-10">
      <div className="flex items-center px-4 py-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg border border-white/10"
        >
          ←
        </button>
        <h2 className="text-white font-bold text-lg flex-1 text-center pr-10">Select Level</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="grid grid-cols-5 gap-2.5 max-w-sm mx-auto">
          {Array.from({ length: totalDisplay }, (_, i) => {
            const level = i + 1;
            const unlocked = level <= maxLevel;
            const stars = levelStars[String(level)] || 0;
            return (
              <button
                key={level}
                onClick={() => unlocked && onSelectLevel(level)}
                disabled={!unlocked}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center font-bold transition-all active:scale-90 ${
                  unlocked ? 'text-white' : 'text-white/20'
                }`}
                style={{
                  background: unlocked
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${unlocked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                <span className="text-sm">{level}</span>
                {unlocked && stars > 0 && (
                  <div className="flex gap-0 mt-0.5">
                    {[1, 2, 3].map((s) => (
                      <span key={s} className="text-[8px]">{s <= stars ? '⭐' : '☆'}</span>
                    ))}
                  </div>
                )}
                {!unlocked && <span className="text-[10px]">🔒</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function HomeScreen({ currentLevel, levelStars, coins, onPlay, onSelectLevel, onSettings, onDailyReward, canClaimDaily }) {
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  if (showLevelSelect) {
    return (
      <LevelSelect
        currentLevel={currentLevel}
        levelStars={levelStars}
        onSelectLevel={(level) => {
          setShowLevelSelect(false);
          onSelectLevel(level);
        }}
        onBack={() => setShowLevelSelect(false)}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-6 relative z-10">
      {/* Coins display */}
      <div
        className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        style={{
          background: 'linear-gradient(180deg, rgba(60,50,30,0.9) 0%, rgba(40,30,15,0.95) 100%)',
          border: '1.5px solid rgba(200,170,80,0.4)',
        }}
      >
        <span className="text-sm">🪙</span>
        <span className="text-amber-300 font-bold text-sm">{coins}</span>
      </div>

      {/* Logo area */}
      <div className="text-center mb-2">
        <div className="flex justify-center gap-3 mb-5">
          {[0, 1, 2, 3, 4].map((c) => (
            <div
              key={c}
              className="animate-bounce"
              style={{ animationDelay: `${c * 0.12}s`, animationDuration: '1.5s' }}
            >
              <Ball colorId={c} size={36} />
            </div>
          ))}
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-0 tracking-tight drop-shadow-lg">
          Color Sort
        </h1>
        <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">
          Puzzle
        </h2>
        <p className="text-white/40 text-sm">Sort the balls into matching tubes!</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onPlay}
          className="w-full py-4 rounded-2xl text-white text-lg font-bold shadow-lg active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
            boxShadow: '0 4px 15px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          ▶ Play (Level {currentLevel})
        </button>

        {canClaimDaily && (
          <button
            onClick={onDailyReward}
            className="w-full py-3 rounded-2xl text-white font-semibold active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 4px 12px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          >
            🎁 Daily Reward!
          </button>
        )}

        <button
          onClick={() => setShowLevelSelect(true)}
          className="w-full py-3 rounded-2xl font-semibold active:scale-95 transition-transform text-white"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
            border: '1.5px solid rgba(255,255,255,0.12)',
          }}
        >
          📋 Select Level
        </button>

        <button
          onClick={onSettings}
          className="w-full py-3 rounded-2xl font-semibold active:scale-95 transition-transform text-white"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
            border: '1.5px solid rgba(255,255,255,0.12)',
          }}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="text-white/15 text-xs mt-6">v1.1.0</div>
    </div>
  );
}
