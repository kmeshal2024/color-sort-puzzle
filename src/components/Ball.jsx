import { getColorHex, getColorLight } from '../utils/colors';

export default function Ball({ colorId, size = 36 }) {
  const hex = getColorHex(colorId);
  const light = getColorLight(colorId);

  return (
    <div
      className="rounded-full flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${light}, ${hex} 60%, ${hex})`,
        boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)`,
      }}
    />
  );
}
