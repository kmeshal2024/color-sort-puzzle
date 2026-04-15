import { useState } from 'react';
import { COINS_CONFIG } from '../utils/constants';

const GIFT_COLORS = [
  { bg: 'from-blue-500 to-blue-700', ribbon: 'bg-yellow-400' },
  { bg: 'from-purple-500 to-purple-700', ribbon: 'bg-yellow-400' },
  { bg: 'from-green-500 to-green-700', ribbon: 'bg-yellow-400' },
  { bg: 'from-red-500 to-red-700', ribbon: 'bg-yellow-400' },
  { bg: 'from-pink-500 to-pink-700', ribbon: 'bg-yellow-400' },
  { bg: 'from-teal-500 to-teal-700', ribbon: 'bg-yellow-400' },
  { bg: 'from-amber-500 to-amber-700', ribbon: 'bg-yellow-400' },
];

export default function DailyReward({ streak, onClaim, onClose }) {
  const [claimed, setClaimed] = useState(false);
  const [reward, setReward] = useState(0);

  const handleClaim = () => {
    const amount = onClaim();
    setReward(amount);
    setClaimed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-[fade-in_0.3s_ease-out]">
      <div className="bg-gradient-to-b from-[#1a2550] to-[#0f1835] rounded-2xl p-6 mx-4 w-full max-w-sm text-center shadow-2xl border border-white/10">
        <div className="text-xl font-bold text-white mb-1">Daily Reward!</div>
        <div className="text-white/50 text-sm mb-5">Day {Math.min(streak + 1, 7)} of 7</div>

        {/* Gift boxes grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {COINS_CONFIG.DAILY_REWARDS.map((amount, i) => {
            const active = i === Math.min(streak, 6);
            const past = i < streak;
            const colors = GIFT_COLORS[i];
            return (
              <div
                key={i}
                className={`relative rounded-xl p-2 flex flex-col items-center justify-center aspect-square ${
                  active
                    ? 'ring-2 ring-yellow-400 animate-[pulse-glow_1.5s_ease-in-out_infinite]'
                    : ''
                } ${past ? 'opacity-40' : ''}`}
                style={{
                  background: active
                    ? 'rgba(255,200,0,0.15)'
                    : 'rgba(255,255,255,0.05)',
                }}
              >
                {/* Gift box */}
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-b ${colors.bg} relative mb-1`}
                  style={{
                    boxShadow: active ? '0 0 12px rgba(255,200,0,0.4)' : 'none',
                  }}
                >
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full ${colors.ribbon} rounded-sm`} />
                  <div className={`absolute top-1/2 -translate-y-1/2 left-0 w-full h-2 ${colors.ribbon} rounded-sm`} />
                  {past && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-lg">✓</div>
                  )}
                </div>
                <div className="text-[10px] text-yellow-400 font-bold">{amount} 🪙</div>
                <div className="text-[9px] text-white/40">Day {i + 1}</div>
              </div>
            );
          })}
        </div>

        {!claimed ? (
          <button
            onClick={handleClaim}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
          >
            🎁 Claim Reward
          </button>
        ) : (
          <div className="animate-[slide-up_0.3s_ease-out]">
            <div className="text-3xl mb-2">🪙</div>
            <div className="text-2xl font-bold text-yellow-400 mb-3">+{reward} Coins!</div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold shadow-lg active:scale-95 transition-transform"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
