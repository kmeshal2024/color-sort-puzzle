import { useEffect, useCallback, useMemo, useState } from 'react';
import Tube from './Tube';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import LevelComplete from './LevelComplete';
import Confetti from './Confetti';
import { useGameLogic } from '../hooks/useGameLogic';
import { isValidMove, getHint } from '../utils/solver';
import { MAX_BALLS_PER_TUBE, COINS_CONFIG } from '../utils/constants';

export default function Game({
  level,
  settings,
  hintsRemaining,
  coins,
  onHome,
  onSettings,
  onLevelComplete,
  onUseHint,
  onSpendCoins,
  playSound,
  vibrate,
}) {
  const {
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
  } = useGameLogic();

  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    loadLevel(level);
    setShowComplete(false);
  }, [level, loadLevel]);

  useEffect(() => {
    if (state.gameStatus === 'complete') {
      playSound('complete');
      vibrate([10, 5, 10, 5, 20]);
      setTimeout(() => setShowComplete(true), 600);
    }
  }, [state.gameStatus, playSound, vibrate]);

  const handleTubeTap = useCallback(
    (index) => {
      if (state.gameStatus !== 'playing') return;

      if (state.selectedTube === null) {
        if (state.tubes[index].length === 0) return;
        selectTube(index);
        playSound('pick');
        vibrate(10);
      } else if (state.selectedTube === index) {
        deselect();
      } else {
        if (isValidMove(state.tubes, state.selectedTube, index)) {
          moveBalls(state.selectedTube, index);
          playSound('drop');
          vibrate(5);
        } else {
          playSound('invalid');
          vibrate([20, 10, 20]);
          setShaking(index);
          deselect();
        }
      }
    },
    [state.selectedTube, state.tubes, state.gameStatus, selectTube, deselect, moveBalls, setShaking, playSound, vibrate]
  );

  const handleHint = useCallback(() => {
    if (hintsRemaining > 0) {
      const hint = getHint(state.tubes);
      if (hint) {
        setHint(hint);
        onUseHint();
        playSound('button');
      }
    } else if (coins >= COINS_CONFIG.HINT_COST) {
      onSpendCoins(COINS_CONFIG.HINT_COST);
      const hint = getHint(state.tubes);
      if (hint) {
        setHint(hint);
        playSound('button');
      }
    } else {
      playSound('invalid');
    }
  }, [state.tubes, hintsRemaining, coins, setHint, onUseHint, onSpendCoins, playSound]);

  const handleAddTube = useCallback(() => {
    if (state.extraTubeUsed) return;
    if (coins >= COINS_CONFIG.EXTRA_TUBE_COST) {
      onSpendCoins(COINS_CONFIG.EXTRA_TUBE_COST);
      addTube();
      playSound('button');
    } else {
      playSound('invalid');
    }
  }, [state.extraTubeUsed, coins, addTube, onSpendCoins, playSound]);

  const handleUndo = useCallback(() => {
    undo();
    playSound('button');
  }, [undo, playSound]);

  const handleRestart = useCallback(() => {
    restart();
    playSound('button');
    setShowComplete(false);
  }, [restart, playSound]);

  const tubeCount = state.tubes.length;
  const cols = tubeCount <= 6 ? 3 : tubeCount <= 8 ? 4 : tubeCount <= 10 ? 5 : 6;
  const ballSize = tubeCount <= 8 ? 34 : tubeCount <= 10 ? 30 : 26;

  const completeTubes = useMemo(() => {
    if (state.gameStatus !== 'complete') return new Set();
    return new Set(
      state.tubes
        .map((t, i) => (t.length === MAX_BALLS_PER_TUBE && t.every((b) => b === t[0]) ? i : -1))
        .filter((i) => i >= 0)
    );
  }, [state.tubes, state.gameStatus]);

  return (
    <div className="flex flex-col h-full relative z-10">
      <TopBar level={state.level} moves={state.moves} coins={coins} onSettings={onSettings} onHome={onHome} />

      {/* Game board */}
      <div className="flex-1 flex items-center justify-center px-2">
        <div
          className="grid gap-3 justify-items-center"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            maxWidth: cols * (ballSize + 32),
          }}
        >
          {state.tubes.map((balls, i) => (
            <Tube
              key={i}
              balls={balls}
              index={i}
              isSelected={state.selectedTube === i}
              isHintFrom={state.hintMove?.[0] === i}
              isHintTo={state.hintMove?.[1] === i}
              isShaking={state.shakingTube === i}
              isComplete={completeTubes.has(i)}
              onTap={handleTubeTap}
              ballSize={ballSize}
            />
          ))}
        </div>
      </div>

      <BottomBar
        onUndo={handleUndo}
        onHint={handleHint}
        onAddTube={handleAddTube}
        onRestart={handleRestart}
        canUndo={state.moveHistory.length > 0}
        canAddTube={!state.extraTubeUsed}
        hintsRemaining={hintsRemaining}
        coins={coins}
      />

      <Confetti active={state.gameStatus === 'complete'} />
      {showComplete && (
        <LevelComplete
          level={state.level}
          moves={state.moves}
          optimalMoves={null}
          onNext={() => onLevelComplete(state.moves)}
          onReplay={handleRestart}
        />
      )}
    </div>
  );
}
