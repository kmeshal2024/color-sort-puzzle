import { useState } from 'react';
import Ball from './Ball';

function LevelSelect({ currentLevel, levelStars, onSelectLevel, onBack }) {
  const maxLevel = Math.max(currentLevel, 1);
  const totalDisplay = Math.ceil(maxLevel / 10) * 10 + 10; // show a few ahead

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-4 py-3">
        <button onClick={onBack} className="text-white/70 text-xl p-2">←</button>
        <h2 className="text-white font-bold text-lg flex-1 text-center pr-10">Select Level</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="grid grid-cols-5 gap-3 max-w-sm mx-auto">
          {Array.from({ length: totalDisplay }, (_, i) => {
            const level = i + 1;
            const unlocked = level <= maxLevel;
            const stars = levelStars[String(level)] || 0;
            return (
              <button
                key={level}
                onClick={() => unlocked && onSelectLevel(level)}
                disabled={!unlocked}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all active:scale-95 ${
                  unlocked
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-white/5 text-white/20'
                }`}
              >
                <span>{level}</span>
                {unlocked && stars > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
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

export default function HomeScreen({ currentLevel, levelStars, onPlay, onSelectLevel, onSettings }) {
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
    <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
      {/* Logo area */}
      <div className="text-center mb-4">
        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2, 3, 4].map((c) => (
            <div
              key={c}
              className="animate-bounce"
              style={{ animationDelay: `${c * 0.1}s` }}
            >
              <Ball colorId={c} size={32} />
            </div>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">Color Sort</h1>
        <h2 className="text-3xl font-bold text-white mb-2">Puzzle</h2>
        <p className="text-white/40 text-sm">Sort the balls into matching tubes!</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onPlay}
          className="w-full py-4 rounded-2xl bg-blue-500 text-white text-lg font-bold shadow-lg active:scale-95 transition-transform"
        >
          ▶ Play (Level {currentLevel})
        </button>
        <button
          onClick={() => setShowLevelSelect(true)}
          className="w-full py-3 rounded-2xl bg-white/10 text-white font-semibold active:scale-95 transition-transform"
        >
          📋 Select Level
        </button>
        <button
          onClick={onSettings}
          className="w-full py-3 rounded-2xl bg-white/10 text-white font-semibold active:scale-95 transition-transform"
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="text-white/20 text-xs mt-8">v1.0.0</div>
    </div>
  );
}
