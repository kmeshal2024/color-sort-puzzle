import { useReducer, useCallback } from 'react';
import { generateLevel } from '../utils/levelGenerator';
import { isValidMove, isSolved, getConsecutiveTop } from '../utils/solver';
import { MAX_BALLS_PER_TUBE } from '../utils/constants';

const initialState = {
  tubes: [],
  selectedTube: null,
  moveHistory: [],
  moves: 0,
  level: 1,
  gameStatus: 'playing', // 'playing' | 'complete'
  extraTubeUsed: false,
  hintMove: null,
  shakingTube: null,
  animatingBall: null, // { from, to, color, count }
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_LEVEL': {
      const { tubes, level } = action.payload;
      return {
        ...initialState,
        tubes,
        level,
        gameStatus: 'playing',
      };
    }
    case 'SELECT_TUBE': {
      const idx = action.payload;
      if (state.gameStatus !== 'playing') return state;
      if (state.tubes[idx].length === 0) return state;
      return { ...state, selectedTube: idx, hintMove: null };
    }
    case 'DESELECT': {
      return { ...state, selectedTube: null };
    }
    case 'MOVE': {
      const { from, to } = action.payload;
      const tubes = state.tubes.map(t => [...t]);
      const { color, count } = getConsecutiveTop(tubes[from]);
      const space = MAX_BALLS_PER_TUBE - tubes[to].length;
      const moveCount = Math.min(count, space);
      const prevTubes = state.tubes.map(t => [...t]);
      for (let i = 0; i < moveCount; i++) {
        tubes[from].pop();
        tubes[to].push(color);
      }
      const won = isSolved(tubes);
      return {
        ...state,
        tubes,
        selectedTube: null,
        moveHistory: [...state.moveHistory, prevTubes],
        moves: state.moves + 1,
        gameStatus: won ? 'complete' : 'playing',
        hintMove: null,
        animatingBall: null,
      };
    }
    case 'UNDO': {
      if (state.moveHistory.length === 0) return state;
      const prev = state.moveHistory[state.moveHistory.length - 1];
      return {
        ...state,
        tubes: prev,
        moveHistory: state.moveHistory.slice(0, -1),
        moves: state.moves - 1,
        selectedTube: null,
        gameStatus: 'playing',
        hintMove: null,
      };
    }
    case 'ADD_TUBE': {
      if (state.extraTubeUsed) return state;
      return {
        ...state,
        tubes: [...state.tubes, []],
        extraTubeUsed: true,
        hintMove: null,
      };
    }
    case 'SET_HINT': {
      return { ...state, hintMove: action.payload };
    }
    case 'SET_SHAKING': {
      return { ...state, shakingTube: action.payload };
    }
    case 'SET_ANIMATING': {
      return { ...state, animatingBall: action.payload };
    }
    default:
      return state;
  }
}

export function useGameLogic() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadLevel = useCallback((level) => {
    const { tubes } = generateLevel(level);
    dispatch({ type: 'LOAD_LEVEL', payload: { tubes, level } });
  }, []);

  const selectTube = useCallback((index) => {
    dispatch({ type: 'SELECT_TUBE', payload: index });
  }, []);

  const deselect = useCallback(() => {
    dispatch({ type: 'DESELECT' });
  }, []);

  const moveBalls = useCallback((from, to) => {
    dispatch({ type: 'MOVE', payload: { from, to } });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const addTube = useCallback(() => {
    dispatch({ type: 'ADD_TUBE' });
  }, []);

  const setHint = useCallback((move) => {
    dispatch({ type: 'SET_HINT', payload: move });
  }, []);

  const setShaking = useCallback((index) => {
    dispatch({ type: 'SET_SHAKING', payload: index });
    setTimeout(() => dispatch({ type: 'SET_SHAKING', payload: null }), 300);
  }, []);

  const restart = useCallback(() => {
    loadLevel(state.level);
  }, [loadLevel, state.level]);

  return {
    state,
    loadLevel,
    selectTube,
    deselect,
    moveBalls,
    undo,
    addTube,
    setHint,
    setShaking,
    restart,
  };
}
