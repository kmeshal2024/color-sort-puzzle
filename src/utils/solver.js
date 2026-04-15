import { MAX_BALLS_PER_TUBE } from './constants';

function tubesKey(tubes) {
  return tubes.map(t => t.join(',')).join('|');
}

function isSolved(tubes) {
  return tubes.every(
    t => t.length === 0 || (t.length === MAX_BALLS_PER_TUBE && t.every(b => b === t[0]))
  );
}

function isValidMove(tubes, from, to) {
  if (from === to) return false;
  if (tubes[from].length === 0) return false;
  if (tubes[to].length >= MAX_BALLS_PER_TUBE) return false;
  if (tubes[to].length === 0) return true;
  return tubes[to][tubes[to].length - 1] === tubes[from][tubes[from].length - 1];
}

function getConsecutiveTop(tube) {
  if (tube.length === 0) return { color: -1, count: 0 };
  const color = tube[tube.length - 1];
  let count = 0;
  for (let i = tube.length - 1; i >= 0; i--) {
    if (tube[i] === color) count++;
    else break;
  }
  return { color, count };
}

function applyMove(tubes, from, to) {
  const newTubes = tubes.map(t => [...t]);
  const { count } = getConsecutiveTop(newTubes[from]);
  const color = newTubes[from][newTubes[from].length - 1];
  const space = MAX_BALLS_PER_TUBE - newTubes[to].length;
  const moveCount = Math.min(count, space);
  for (let i = 0; i < moveCount; i++) {
    newTubes[from].pop();
    newTubes[to].push(color);
  }
  return newTubes;
}

// BFS solver - returns array of moves [from, to] or null if unsolvable
export function solve(tubes, maxSteps = 50) {
  if (isSolved(tubes)) return [];

  const visited = new Set();
  const queue = [{ tubes, moves: [] }];
  visited.add(tubesKey(tubes));

  while (queue.length > 0) {
    const { tubes: current, moves } = queue.shift();
    if (moves.length >= maxSteps) continue;

    for (let from = 0; from < current.length; from++) {
      if (current[from].length === 0) continue;
      // Skip moving from a completed tube
      const { color: fromColor, count: fromCount } = getConsecutiveTop(current[from]);
      if (fromCount === MAX_BALLS_PER_TUBE) continue;

      for (let to = 0; to < current.length; to++) {
        if (!isValidMove(current, from, to)) continue;

        // Skip pointless moves: moving to empty tube when source only has one color
        if (current[to].length === 0 && current[from].every(b => b === fromColor)) continue;

        const newTubes = applyMove(current, from, to);
        const key = tubesKey(newTubes);
        if (visited.has(key)) continue;
        visited.add(key);

        const newMoves = [...moves, [from, to]];
        if (isSolved(newTubes)) return newMoves;

        // Limit memory usage
        if (visited.size > 50000) return null;

        queue.push({ tubes: newTubes, moves: newMoves });
      }
    }
  }
  return null;
}

// Get the next optimal move (hint)
export function getHint(tubes) {
  const solution = solve(tubes, 30);
  if (solution && solution.length > 0) {
    return solution[0]; // [from, to]
  }
  return null;
}

export { isSolved, isValidMove, getConsecutiveTop, applyMove };
