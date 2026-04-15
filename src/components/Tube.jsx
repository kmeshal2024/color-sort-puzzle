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
  const gap = 3;
  const padding = 8;
  const tubeHeight = (ballSize + gap) * MAX_BALLS_PER_TUBE + padding * 2 + 4;
  const tubeWidth = ballSize + 22;
  const rimWidth = tubeWidth + 8;

  const topBall = isSelected && balls.length > 0 ? balls[balls.length - 1] : null;

  let wrapperClasses = 'relative';
  if (isShaking) wrapperClasses += ' animate-[shake_0.3s_ease-in-out]';
  if (isComplete) wrapperClasses += ' animate-[celebrate_0.5s_ease-in-out_3]';

  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={() => onTap(index)}>
      {/* Floating ball indicator */}
      <div className="flex items-end justify-center" style={{ height: ballSize + 12, marginBottom: 4 }}>
        {isSelected && topBall !== undefined && topBall !== null && (
          <div style={{ animation: 'float-up 0.15s ease-out' }}>
            <Ball colorId={topBall} size={ballSize} />
          </div>
        )}
      </div>

      <div className={wrapperClasses}>
        {/* Tube rim / opening */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-1 z-10"
          style={{
            width: rimWidth,
            height: 14,
            borderRadius: '6px 6px 0 0',
            background: 'linear-gradient(180deg, rgba(200,210,230,0.6) 0%, rgba(150,170,200,0.3) 100%)',
            border: '2px solid rgba(255,255,255,0.25)',
            borderBottom: 'none',
          }}
        />

        {/* Main glass tube body */}
        <div
          style={{
            width: tubeWidth,
            height: tubeHeight,
            borderRadius: `4px 4px ${tubeWidth / 2}px ${tubeWidth / 2}px`,
            background: `linear-gradient(90deg,
              rgba(255,255,255,0.08) 0%,
              rgba(255,255,255,0.15) 15%,
              rgba(255,255,255,0.05) 40%,
              rgba(255,255,255,0.02) 60%,
              rgba(255,255,255,0.12) 85%,
              rgba(255,255,255,0.06) 100%
            )`,
            borderLeft: `2px solid ${
              isSelected ? 'rgba(100, 180, 255, 0.7)' : isHintFrom ? 'rgba(255, 204, 0, 0.7)' : isHintTo ? 'rgba(68, 255, 68, 0.7)' : 'rgba(255,255,255,0.18)'
            }`,
            borderRight: `2px solid ${
              isSelected ? 'rgba(100, 180, 255, 0.7)' : isHintFrom ? 'rgba(255, 204, 0, 0.7)' : isHintTo ? 'rgba(68, 255, 68, 0.7)' : 'rgba(255,255,255,0.18)'
            }`,
            borderBottom: `2px solid ${
              isSelected ? 'rgba(100, 180, 255, 0.7)' : isHintFrom ? 'rgba(255, 204, 0, 0.7)' : isHintTo ? 'rgba(68, 255, 68, 0.7)' : 'rgba(255,255,255,0.18)'
            }`,
            borderTop: 'none',
            boxShadow: isSelected
              ? '0 0 20px rgba(100, 180, 255, 0.4), inset 0 0 15px rgba(100, 180, 255, 0.1)'
              : isHintFrom || isHintTo
              ? '0 0 15px rgba(255, 204, 0, 0.3)'
              : `inset -4px 0 8px rgba(255,255,255,0.04),
                 inset 4px 0 8px rgba(0,0,0,0.1),
                 0 4px 12px rgba(0,0,0,0.3)`,
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'center',
            padding: `${padding}px 0`,
            gap: `${gap}px`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glass reflection stripe (left side) */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: 4,
              top: 8,
              bottom: 12,
              width: 5,
              borderRadius: 3,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%)',
            }}
          />
          {/* Glass reflection stripe (right side, subtle) */}
          <div
            className="absolute pointer-events-none"
            style={{
              right: 5,
              top: 20,
              bottom: 20,
              width: 3,
              borderRadius: 3,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            }}
          />

          {balls.map((colorId, i) => (
            <div
              key={i}
              className="flex justify-center relative z-[1]"
              style={{
                opacity: isSelected && i === balls.length - 1 ? 0.3 : 1,
              }}
            >
              <Ball colorId={colorId} size={ballSize} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
