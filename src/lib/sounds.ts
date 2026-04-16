"use client";

let soundEnabled = false;
let audioCtx: AudioContext | null = null;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (enabled && !audioCtx) {
    audioCtx = new AudioContext();
  }
}

export function isSoundEnabled() {
  return soundEnabled;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "square") {
  if (!soundEnabled || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function playChomp() {
  if (!audioCtx) return;
  playTone(600, 0.08);
  setTimeout(() => playTone(500, 0.08), 100);
}

export function playGhostSiren() {
  if (!audioCtx) return;
  playTone(200, 0.3, "sawtooth");
  setTimeout(() => playTone(300, 0.3, "sawtooth"), 300);
}

export function playSelect() {
  if (!audioCtx) return;
  playTone(800, 0.05);
  setTimeout(() => playTone(1000, 0.05), 60);
  setTimeout(() => playTone(1200, 0.08), 120);
}
