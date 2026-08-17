let audioContext = null;

const profiles = {
  confirm: { start: 420, end: 680, duration: 0.13, type: "triangle" },
  select: { start: 460, end: 520, duration: 0.08, type: "sine" },
  move: { start: 180, end: 220, duration: 0.06, type: "sine" },
  scan: { start: 300, end: 520, duration: 0.2, type: "sine" },
  pickup: { start: 420, end: 880, duration: 0.24, type: "triangle" },
  error: { start: 150, end: 110, duration: 0.16, type: "square" }
};

const getAudioContext = () => {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
};

export const playUiSound = (kind) => {
  const context = getAudioContext();
  if (!context) return;

  const profile = profiles[kind] || profiles.select;
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = profile.type;
  oscillator.frequency.setValueAtTime(profile.start, now);
  oscillator.frequency.exponentialRampToValueAtTime(profile.end, now + profile.duration);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);

  oscillator.connect(filter).connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + profile.duration + 0.02);
};
