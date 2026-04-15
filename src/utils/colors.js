export const COLORS = [
  { id: 0, hex: '#FF4444', name: 'Red' },
  { id: 1, hex: '#4488FF', name: 'Blue' },
  { id: 2, hex: '#44BB44', name: 'Green' },
  { id: 3, hex: '#FFCC00', name: 'Yellow' },
  { id: 4, hex: '#AA44FF', name: 'Purple' },
  { id: 5, hex: '#FF8844', name: 'Orange' },
  { id: 6, hex: '#FF66AA', name: 'Pink' },
  { id: 7, hex: '#44DDDD', name: 'Cyan' },
  { id: 8, hex: '#AA7744', name: 'Brown' },
  { id: 9, hex: '#88DD00', name: 'Lime' },
  { id: 10, hex: '#4444CC', name: 'Indigo' },
  { id: 11, hex: '#008888', name: 'Teal' },
];

export function getColor(id) {
  return COLORS[id] || COLORS[0];
}

export function getColorHex(id) {
  return COLORS[id]?.hex || '#888888';
}

// Lighter shade for ball gradient highlight
export function getColorLight(id) {
  const hex = getColorHex(id);
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 60);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 60);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 60);
  return `rgb(${r}, ${g}, ${b})`;
}
