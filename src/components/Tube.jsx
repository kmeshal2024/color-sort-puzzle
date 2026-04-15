import Ball from './Ball';
import { MAX_BALLS_PER_TUBE } from '../utils/constants';

export default function Tube({
  balls,
  index,
  isSelected,
  isHintFrom,
  isHintTo,
  isShaking,
  isComplete,
  onTap,
  ballSize,
}) {
  const tubeHeight = (ballSize + 4) * MAX_BALLS_PER_TUBE + 16;
  const tubeWidth = ballSize + 20;

  // Floating ball(s) above selected tube
  const topBall = isSelected && balls.length > 0 ? balls[balls.length - 1] : null;

  let tubeClasses = 'relative flex flex-col-reverse items-center rounded-b-2xl transition-all duration-150 cursor-pointer';
  if (isShaking) tubeClasses += ' animate-[shake_0.3s_ease-in-out]';
  if (isComplete) tubeClasses += ' animate-[celebrate_0.5s_ease-in-out_3]';

  return (
    <div className="flex flex-col items-center" onClick={() => onTap(index)}>
      {/* Floating ball indicator */}
      <div className="h-10 flex items-end justify-center mb-1">
        {isSelected && topBall !== undefined && topBall !== null && (
          <div className="animate-[float-up_0.15s_ease-out]" style={{ animation: 'none' }}>
            <Ball colorId={topBall} size={ballSize} />
          </div>
        )}
      </div>

      {/* Tube container */}
      <div
        className={tubeClasses}
        style={{
          width: tubeWidth,
          height: tubeHeight,
          background: 'rgba(255,255,255,0.08)',
          border: `2px solid ${
            isSelected
              ? 'rgba(68, 136, 255, 0.8)'
              : isHintFrom
              ? 'rgba(255, 204, 0, 0.8)'
              : isHintTo
              ? 'rgba(68, 255, 68, 0.8)'
              : 'rgba(255,255,255,0.15)'
          }`,
          borderTop: 'none',
          boxShadow: isSelected
            ? '0 0 15px rgba(68, 136, 255, 0.4)'
            : isHintFrom || isHintTo
            ? '0 0 12px rgba(255, 204, 0, 0.3)'
            : '0 2px 8px rgba(0,0,0,0.3)',
          padding: '4px 0',
        }}
      >
        {balls.map((colorId, i) => (
          <div
            key={i}
            className="flex justify-center"
            style={{
              marginBottom: i === 0 ? 4 : 2,
              opacity: isSelected && i === balls.length - 1 ? 0.3 : 1,
            }}
          >
            <Ball colorId={colorId} size={ballSize} />
          </div>
        ))}
      </div>
    </div>
  );
}
