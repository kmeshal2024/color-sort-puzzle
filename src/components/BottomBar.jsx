import { COINS_CONFIG } from '../utils/constants';

export default function BottomBar({ onUndo, onHint, onAddTube, onRestart, canUndo, canAddTube, hintsRemaining, coins }) {
  const btnBase =
    'flex flex-col items-center justify-center gap-0.5 rounded-2xl min-w-[68px] min-h-[58px] active:scale-90 transition-transform';

  const btnStyle = (enabled) => ({
    background: enabled
      ? 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)'
      : 'rgba(255,255,255,0.03)',
    border: `1.5px solid ${enabled ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}`,
    backdropFilter: 'blur(4px)',
  });

  return (
    <div className="flex items-center justify-center gap-2.5 px-4 py-2 w-full max-w-lg mx-auto z-10 relative">
      {/* Undo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`${btnBase} ${canUndo ? 'text-white' : 'text-white/25'}`}
        style={btnStyle(canUndo)}
      >
        <span className="text-xl">↩️</span>
        <span className="text-[10px] font-medium">Undo</span>
      </button>

      {/* Hint */}
      <button
        onClick={onHint}
        className={`${btnBase} text-white`}
        style={btnStyle(true)}
      >
        <span className="text-xl">💡</span>
        <span className="text-[10px] font-medium">
          {hintsRemaining > 0 ? `Hint (${hintsRemaining})` : `${COINS_CONFIG.HINT_COST} 🪙`}
        </span>
      </button>

      {/* Add tube */}
      <button
        onClick={onAddTube}
        disabled={!canAddTube}
        className={`${btnBase} ${canAddTube ? 'text-white' : 'text-white/25'}`}
        style={btnStyle(canAddTube)}
      >
        <span className="text-xl">➕</span>
        <span className="text-[10px] font-medium">
          {canAddTube ? `${COINS_CONFIG.EXTRA_TUBE_COST} 🪙` : 'Used'}
        </span>
      </button>

      {/* Restart */}
      <button
        onClick={onRestart}
        className={`${btnBase} text-white`}
        style={btnStyle(true)}
      >
        <span className="text-xl">🔄</span>
        <span className="text-[10px] font-medium">Restart</span>
      </button>
    </div>
  );
}
