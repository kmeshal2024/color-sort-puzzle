import { THEMES } from '../utils/constants';

export default function SettingsModal({ settings, currentLevel, onUpdate, onClose }) {
  const toggle = (key) => onUpdate({ [key]: !settings[key] });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-[fade-in_0.3s_ease-out]">
      <div className="bg-gradient-to-b from-[#1e2a4a] to-[#162040] rounded-2xl p-6 mx-4 w-full max-w-sm shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="text-white/60 text-2xl p-1">✕</button>
        </div>

        {/* Sound toggle */}
        <div className="flex items-center justify-between py-3 border-b border-white/10">
          <span className="text-white/80">🔊 Sound</span>
          <button
            onClick={() => toggle('sound')}
            className={`w-12 h-7 rounded-full transition-colors ${
              settings.sound ? 'bg-blue-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow transition-transform mx-1 ${
                settings.sound ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Vibration toggle */}
        <div className="flex items-center justify-between py-3 border-b border-white/10">
          <span className="text-white/80">📳 Vibration</span>
          <button
            onClick={() => toggle('vibration')}
            className={`w-12 h-7 rounded-full transition-colors ${
              settings.vibration ? 'bg-blue-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow transition-transform mx-1 ${
                settings.vibration ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Theme selection */}
        <div className="py-3">
          <span className="text-white/80 block mb-3">🎨 Theme</span>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((theme) => {
              const unlocked = currentLevel >= theme.unlockLevel;
              const active = settings.theme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => unlocked && onUpdate({ theme: theme.id })}
                  disabled={!unlocked}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-blue-500 text-white'
                      : unlocked
                      ? 'bg-white/10 text-white/80 hover:bg-white/20'
                      : 'bg-white/5 text-white/30'
                  }`}
                >
                  {theme.name}
                  {!unlocked && <span className="block text-xs">🔒 Lv.{theme.unlockLevel}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
