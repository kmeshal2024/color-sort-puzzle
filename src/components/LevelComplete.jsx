import { useMemo } from 'react';

export default function LevelComplete({ level, moves, optimalMoves, onNext, onReplay }) {
  const par = Math.ceil((optimalMoves || moves) * 1.5);
  const stars = moves <= par ? 3 : moves <= par * 1.5 ? 2 : 1;

  const starElements = useMemo(() => {
    return [1, 2, 3].map((s) => (
      <span
        key={s}
        className="text-4xl inline-block"
        style={{
          animation: s <= stars ? `star-pop 0.4s ease-out ${s * 0.15}s forwards` : 'none',
          opacity: s <= stars ? 0 : 1,
          color: s <= stars ? undefined : '#555',
          transform: s <= stars ? 'scale(0)' : 'scale(1)',
        }}
      >
        {s <= stars ? '⭐' : '☆'}
      </span>
    ));
  }, [stars]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-[fade-in_0.3s_ease-out]">
      <div className="bg-gradient-to-b from-[#1e2a4a] to-[#162040] rounded-2xl p-6 mx-4 w-full max-w-sm text-center shadow-2xl border border-white/10">
        <div className="text-2xl font-bold text-white mb-2">Level Complete!</div>
        <div className="text-4xl mb-4">🎉</div>

        <div className="flex justify-center gap-2 mb-4">{starElements}</div>

        <div className="text-white/60 mb-1">Moves: {moves}</div>
        {par > 0 && <div className="text-white/40 text-sm mb-4">Par: {par}</div>}

        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={onReplay}
            className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold active:scale-95 transition-transform"
          >
            Replay
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold active:scale-95 transition-transform shadow-lg"
          >
            Next Level
          </button>
        </div>
      </div>
    </div>
  );
}
