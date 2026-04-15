// Run with: node generate-icons.js
// Generates PNG icons using Canvas (requires the 'canvas' npm package)
// If canvas is not available, creates simple SVG-based placeholder icons

import { writeFileSync, mkdirSync, existsSync } from 'fs';

const SIZES = [48, 72, 96, 144, 192, 512];
const ICON_DIR = 'public/icons';

if (!existsSync(ICON_DIR)) mkdirSync(ICON_DIR, { recursive: true });

function generateSVGIcon(size, maskable = false) {
  const padding = maskable ? size * 0.1 : 0;
  const inner = size - padding * 2;
  const cx = size / 2;

  // Tube and ball dimensions scaled to icon size
  const tubeW = inner * 0.12;
  const tubeH = inner * 0.45;
  const ballR = inner * 0.05;
  const tubeSpacing = inner * 0.22;
  const tubeY = cy(0.35);

  function cy(pct) { return padding + inner * pct; }
  function cxOff(i) { return cx + (i - 1) * tubeSpacing; }

  const colors = [
    ['#FF4444', '#FF4444', '#4488FF', '#FFCC00'],
    ['#4488FF', '#FFCC00', '#44BB44', '#44BB44'],
    ['#FFCC00', '#44BB44', '#FF4444', '#4488FF'],
  ];

  let tubes = '';
  for (let t = 0; t < 3; t++) {
    const tx = cxOff(t);
    const ty = tubeY;
    // Tube glass
    tubes += `<rect x="${tx - tubeW/2}" y="${ty}" width="${tubeW}" height="${tubeH}" rx="${tubeW/4}" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="${size * 0.005}"/>`;
    // Balls
    for (let b = 0; b < 4; b++) {
      const by = ty + tubeH - ballR * 1.2 - b * ballR * 2.2;
      tubes += `<circle cx="${tx}" cy="${by}" r="${ballR}" fill="${colors[t][b]}"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#0f3460"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)" ${maskable ? '' : `rx="${size * 0.18}"`}/>
  ${tubes}
  <text x="${cx}" y="${cy(0.22)}" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-weight="bold" font-size="${inner * 0.1}">CS</text>
</svg>`;
}

// Generate SVG icons and save them
for (const size of SIZES) {
  const svg = generateSVGIcon(size, false);
  writeFileSync(`${ICON_DIR}/icon-${size}.svg`, svg);
  console.log(`Generated icon-${size}.svg`);

  // Maskable versions for 192 and 512
  if (size === 192 || size === 512) {
    const maskSvg = generateSVGIcon(size, true);
    writeFileSync(`${ICON_DIR}/icon-maskable-${size}.svg`, maskSvg);
    console.log(`Generated icon-maskable-${size}.svg`);
  }
}

console.log('\nSVG icons generated. For PNG conversion, use a tool like Inkscape or sharp.');
console.log('For now, update manifest.json to use .svg format, or convert manually.');
