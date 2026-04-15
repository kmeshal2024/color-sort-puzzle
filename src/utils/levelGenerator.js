import { MAX_BALLS_PER_TUBE, DIFFICULTY, EMPTY_TUBES_COUNT } from './constants';

// Seeded PRNG (mulberry32)
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function getDifficulty(level) {
  if (level <= DIFFICULTY.EASY.maxLevel) return DIFFICULTY.EASY;
  if (level <= DIFFICULTY.MEDIUM.maxLevel) return DIFFICULTY.MEDIUM;
  if (level <= DIFFICULTY.HARD.maxLevel) return DIFFICULTY.HARD;
  return DIFFICULTY.EXPERT;
}

function createSolvedState(numColors) {
  const tubes = [];
  for (let i = 0; i < numColors; i++) {
    tubes.push(Array(MAX_BALLS_PER_TUBE).fill(i));
  }
  for (let i = 0; i < EMPTY_TUBES_COUNT; i++) {
    tubes.push([]);
  }
  return tubes;
}

function cloneTubes(tubes) {
  return tubes.map(t => [...t]);
}

// Perform a random valid move (for shuffling from solved state)
function getValidMoves(tubes) {
  const moves = [];
  for (let from = 0; from < tubes.length; from++) {
    if (tubes[from].length === 0) continue;
    for (let to = 0; to < tubes.length; to++) {
      if (from === to) continue;
      if (tubes[to].length >= MAX_BALLS_PER_TUBE) continue;
      // For shuffling we allow any move (not just same-color)
      moves.push([from, to]);
    }
  }
  return moves;
}

function isSolved(tubes) {
  return tubes.every(
    t => t.length === 0 || (t.length === MAX_BALLS_PER_TUBE && t.every(b => b === t[0]))
  );
}

function shuffle(tubes, rand, numMoves) {
  let current = cloneTubes(tubes);
  let lastFrom = -1, lastTo = -1;
  for (let i = 0; i < numMoves; i++) {
    const moves = getValidMoves(current).filter(
      ([f, t]) => !(f === lastTo && t === lastFrom) // avoid undoing last move
    );
    if (moves.length === 0) break;
    const [from, to] = moves[Math.floor(rand() * moves.length)];
    const ball = current[from].pop();
    current[to].push(ball);
    lastFrom = from;
    lastTo = to;
  }
  return current;
}

export function generateLevel(level) {
  const diff = getDifficulty(level);
  const rand = mulberry32(level * 2654435761); // unique seed per level
  const numColors = diff.colors;

  const solved = createSolvedState(numColors);

  // More shuffling for harder levels
  const minMoves = 50 + Math.min(level, 100);
  const maxMoves = minMoves + 100;
  const numMoves = Math.floor(rand() * (maxMoves - minMoves)) + minMoves;

  let tubes = shuffle(solved, rand, numMoves);

  // Make sure it's not already solved or trivially close
  let attempts = 0;
  while (isSolved(tubes) && attempts < 10) {
    tubes = shuffle(solved, rand, numMoves + attempts * 20);
    attempts++;
  }

  return {
    tubes,
    numColors,
    numTubes: diff.tubes,
    difficulty: level <= 30 ? 'Easy' : level <= 80 ? 'Medium' : level <= 150 ? 'Hard' : 'Expert',
  };
}

export function getLevelConfig(level) {
  const diff = getDifficulty(level);
  return { numColors: diff.colors, numTubes: diff.tubes };
}
