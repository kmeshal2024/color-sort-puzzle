import { useMemo } from 'react';

export default function StarfieldBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep space gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(25, 25, 80, 0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(40, 20, 80, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(15, 40, 80, 0.3) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a1a 0%, #0f1832 30%, #121a3a 60%, #0a0e20 100%)
          `,
        }}
      />
      {/* Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            backgroundColor: `rgba(255, 255, 255, ${s.opacity})`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
