export default function BottomBar({ onUndo, onHint, onAddTube, onRestart, canUndo, canAddTube, hintsRemaining }) {
  const btnClass =
    'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl min-w-[64px] min-h-[56px] active:scale-95 transition-transform';

  return (
    <div className="flex items-center justify-center gap-3 px-4 py-3 w-full max-w-lg mx-auto">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`${btnClass} ${canUndo ? 'bg-white/10 text-white' : 'bg-white/5 text-white/30'}`}
      >
        <span className="text-xl">↩️</span>
        <span className="text-xs">Undo</span>
      </button>

      <button
        onClick={onHint}
        className={`${btnClass} bg-white/10 text-white`}
      >
        <span className="text-xl">💡</span>
        <span className="text-xs">Hint ({hintsRemaining})</span>
      </button>

      <button
        onClick={onAddTube}
        disabled={!canAddTube}
        className={`${btnClass} ${canAddTube ? 'bg-white/10 text-white' : 'bg-white/5 text-white/30'}`}
      >
        <span className="text-xl">➕</span>
        <span className="text-xs">+1 Tube</span>
      </button>

      <button
        onClick={onRestart}
        className={`${btnClass} bg-white/10 text-white`}
      >
        <span className="text-xl">🔄</span>
        <span className="text-xs">Restart</span>
      </button>
    </div>
  );
}
