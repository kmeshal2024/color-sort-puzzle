import { useMemo } from 'react';
import { COINS_CONFIG } from '../utils/constants';

export default function LevelComplete({ level, moves, optimalMoves, onNext, onReplay }) {
  const par = Math.ceil((optimalMoves || moves) * 1.5);
  const stars = moves <= par ? 3 : moves <= par * 1.5 ? 2 : 1;

  const coinReward = COINS_CONFIG.LEVEL_COMPLETE_REWARD +
    (stars === 3 ? COINS_CONFIG.THREE_STAR_BONUS : stars === 2 ? COINS_CONFIG.TWO_STAR_BONUS : 0);

  const starElements = useMemo(() => {
    return [1, 2, 3].map((s) => (
      <span
        key={s}
        className="text-5xl inline-block"
        style={{
          animation: s <= stars ? `star-pop 0.4s ease-out ${s * 0.2}s forwards` : 'none',
          opacity: s <= stars ? 0 : 1,
          color: s <= stars ? undefined : '#333',
          transform: s <= stars ? 'scale(0)' : 'scale(1)',
        }}
      >
        {s <= stars ? '⭐' : '☆'}
      </span>
    ));
  }, [stars]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-[fade-in_0.3s_ease-out]">
      <div
        className="rounded-2xl p-6 mx-4 w-full max-w-sm text-center shadow-2xl border border-white/10"
        style={{
          background: 'linear-gradient(180deg, #1a2550 0%, #0f1835 100%)',
        }}
      >
        <div className="text-2xl font-bold text-white mb-1">Level Complete!</div>
        <div className="text-4xl mb-3">🎉</div>

        <div className="flex justify-center gap-2 mb-4">{starElements}</div>

        <div className="text-white/60 mb-1 text-sm">Moves: {moves}</div>
        {par > 0 && <div className="text-white/30 text-xs mb-3">Par: {par}</div>}

        {/* Coin reward */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.2) 100%)',
            border: '1.5px solid rgba(245,158,11,0.3)',
            animation: 'slide-up 0.5s ease-out 0.6s both',
          }}
        >
          <span className="text-xl">🪙</span>
          <span className="text-amber-300 font-bold text-lg">+{coinReward}</span>
        </div>

        <div className="flex gap-3 justify-center mt-2">
          <button
            onClick={onReplay}
            className="px-6 py-3 rounded-xl font-semibold active:scale-95 transition-transform text-white"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
              border: '1.5px solid rgba(255,255,255,0.12)',
            }}
          >
            Replay
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 rounded-xl text-white font-bold active:scale-95 transition-transform shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
            }}
          >
            Next Level →
          </button>
        </div>
      </div>
    </div>
  );
}
