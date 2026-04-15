import { useCallback, useRef } from 'react';

const audioCtxRef = { current: null };

function getAudioContext() {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtxRef.current.state === 'suspended') {
    audioCtxRef.current.resume();
  }
  return audioCtxRef.current;
}

function playTone(frequency, duration, type = 'sine', freqEnd = null) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    if (freqEnd) {
      osc.frequency.linearRampToValueAtTime(freqEnd, ctx.currentTime + duration / 1000);
    }
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (e) {
    // Audio not available
  }
}

function playArpeggio(frequencies, noteLength) {
  const ctx = getAudioContext();
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    const start = ctx.currentTime + (i * noteLength) / 1000;
    gain.gain.setValueAtTime(0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + noteLength / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + noteLength / 1000 + 0.05);
  });
}

export function useSound(enabled) {
  const play = useCallback(
    (type) => {
      if (!enabled) return;
      switch (type) {
        case 'pick':
          playTone(800, 80, 'sine');
          break;
        case 'drop':
          playTone(600, 120, 'sine', 400);
          break;
        case 'invalid':
          playTone(200, 150, 'square');
          break;
        case 'complete':
          playArpeggio([523, 659, 784, 1047], 100); // C5 E5 G5 C6
          break;
        case 'button':
          playTone(500, 50, 'sine');
          break;
      }
    },
    [enabled]
  );

  return play;
}
