export default function TopBar({ level, moves, onSettings, onHome }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 w-full max-w-lg mx-auto">
      <button
        onClick={onHome}
        className="text-white/70 hover:text-white text-xl p-2"
        aria-label="Home"
      >
        🏠
      </button>
      <div className="text-center">
        <div className="text-white/90 font-bold text-lg">Level {level}</div>
        <div className="text-white/50 text-sm">Moves: {moves}</div>
      </div>
      <button
        onClick={onSettings}
        className="text-white/70 hover:text-white text-xl p-2"
        aria-label="Settings"
      >
        ⚙️
      </button>
    </div>
  );
}
