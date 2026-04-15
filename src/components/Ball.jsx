import { getColorHex, getColorLight } from '../utils/colors';

export default function Ball({ colorId, size = 36 }) {
  const hex = getColorHex(colorId);
  const light = getColorLight(colorId);

  // Darker shade for bottom shadow
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 50);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 50);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 50);
  const dark = `rgb(${r}, ${g}, ${b})`;

  return (
    <div
      className="rounded-full flex-shrink-0 relative"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 38% 32%, white 0%, ${light} 10%, ${hex} 45%, ${dark} 100%)`,
        boxShadow: `
          inset 0 -${size * 0.08}px ${size * 0.15}px rgba(0,0,0,0.35),
          inset 0 ${size * 0.05}px ${size * 0.1}px rgba(255,255,255,0.15),
          0 ${size * 0.06}px ${size * 0.12}px rgba(0,0,0,0.4),
          0 ${size * 0.02}px ${size * 0.04}px rgba(0,0,0,0.2)
        `,
      }}
    >
      {/* Primary shine spot */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.35,
          height: size * 0.22,
          top: size * 0.12,
          left: size * 0.2,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
          transform: 'rotate(-20deg)',
        }}
      />
      {/* Small secondary shine */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.12,
          height: size * 0.08,
          bottom: size * 0.22,
          right: size * 0.22,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
        }}
      />
    </div>
  );
}
