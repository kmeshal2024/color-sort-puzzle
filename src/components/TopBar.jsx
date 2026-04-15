export default function TopBar({ level, moves, coins, onSettings, onHome }) {
  return (
    <div className="relative w-full max-w-lg mx-auto px-3 pt-2 pb-1 z-10">
      <div className="flex items-center justify-between">
        {/* Home button */}
        <button
          onClick={onHome}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-lg active:scale-90 transition-transform border border-white/10"
          aria-label="Home"
        >
          🏠
        </button>

        {/* Level badge */}
        <div
          className="px-5 py-1.5 rounded-full text-center"
          style={{
            background: 'linear-gradient(180deg, rgba(60,50,30,0.9) 0%, rgba(40,30,15,0.95) 100%)',
            border: '2px solid rgba(200,170,80,0.5)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <div className="text-amber-200 font-bold text-sm leading-tight">Level {level}</div>
          <div className="text-amber-200/50 text-[11px]">{moves} moves</div>
        </div>

        {/* Coins + Settings */}
        <div className="flex items-center gap-2">
          {/* Coins display */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{
              background: 'linear-gradient(180deg, rgba(60,50,30,0.9) 0%, rgba(40,30,15,0.95) 100%)',
              border: '1.5px solid rgba(200,170,80,0.4)',
            }}
          >
            <span className="text-sm" style={{ animation: 'coin-spin 3s linear infinite' }}>🪙</span>
            <span className="text-amber-300 font-bold text-sm">{coins}</span>
          </div>

          {/* Settings button */}
          <button
            onClick={onSettings}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-lg active:scale-90 transition-transform border border-white/10"
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
}
