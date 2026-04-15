import { useCallback } from 'react';

let audioCtx = null;
let unlocked = false;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Must be called from a user gesture (click/tap) to unlock audio on mobile
function ensureUnlocked() {
  if (unlocked) return;
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  // Play a silent buffer to unlock on iOS
  const buffer = ctx.createBuffer(1, 1, 22050);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
  unlocked = true;
}

function playTone(frequency, duration, type = 'sine', volume = 0.4, freqEnd = null) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    if (freqEnd) {
      osc.frequency.linearRampToValueAtTime(freqEnd, ctx.currentTime + duration / 1000);
    }
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000 + 0.05);
  } catch (e) {
    console.warn('Sound error:', e);
  }
}

function playArpeggio(frequencies, noteLength, volume = 0.35) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      const start = ctx.currentTime + (i * noteLength) / 1000;
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + noteLength / 1000 + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + noteLength / 1000 + 0.15);
    });
  } catch (e) {
    console.warn('Sound error:', e);
  }
}

// Two-tone "plop" for a more satisfying pick sound
function playPick() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  // Quick pop
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(900, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.12);
}

// Satisfying "clink" drop sound
function playDrop() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(700, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);

  // Second harmonic for richness
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(1400, ctx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
  gain2.gain.setValueAtTime(0.2, ctx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(ctx.currentTime);
  osc2.stop(ctx.currentTime + 0.15);
}

// Error buzz
function playInvalid() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.setValueAtTime(0.3, ctx.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.22);
}

// Victory fanfare
function playComplete() {
  playArpeggio([523, 659, 784, 1047], 120, 0.4);
  // Add a shimmering high note at the end
  setTimeout(() => {
    playTone(1568, 300, 'sine', 0.2); // G6
  }, 500);
}

export function useSound(enabled) {
  const play = useCallback(
    (type) => {
      if (!enabled) return;
      ensureUnlocked();
      switch (type) {
        case 'pick':
          playPick();
          break;
        case 'drop':
          playDrop();
          break;
        case 'invalid':
          playInvalid();
          break;
        case 'complete':
          playComplete();
          break;
        case 'button':
          playTone(600, 40, 'sine', 0.25);
          break;
      }
    },
    [enabled]
  );

  return play;
}
