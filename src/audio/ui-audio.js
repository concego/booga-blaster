let audioContext = null;

const profiles = {
  confirm: [{ start: 420, end: 680, duration: 0.13, type: "triangle", volume: 0.12 }],
  select: [{ start: 460, end: 520, duration: 0.08, type: "sine", volume: 0.1 }],
  move: [{ start: 180, end: 220, duration: 0.06, type: "sine", volume: 0.08 }],
  enemyMove: [{ start: 130, end: 105, duration: 0.08, type: "sine", volume: 0.06 }],
  scan: [{ start: 300, end: 520, duration: 0.2, type: "sine", volume: 0.1 }],
  cast: [{ start: 260, end: 760, duration: 0.28, type: "triangle", volume: 0.14 }],
  hit: [{ start: 120, end: 70, duration: 0.12, type: "square", volume: 0.12 }],
  defeat: [
    { start: 440, end: 700, duration: 0.12, type: "triangle", volume: 0.12 },
    { start: 700, end: 980, duration: 0.16, type: "sine", volume: 0.11, delay: 0.11 }
  ],
  enemyAttack: [
    { start: 180, end: 90, duration: 0.15, type: "sawtooth", volume: 0.12 },
    { start: 110, end: 55, duration: 0.12, type: "square", volume: 0.08, delay: 0.1 }
  ],
  damage: [{ start: 100, end: 45, duration: 0.2, type: "sawtooth", volume: 0.14 }],
  blocked: [{ start: 180, end: 110, duration: 0.14, type: "square", volume: 0.09 }],
  pickup: [{ start: 420, end: 880, duration: 0.24, type: "triangle", volume: 0.13 }],
  gameOver: [
    { start: 260, end: 130, duration: 0.22, type: "sawtooth", volume: 0.13 },
    { start: 130, end: 55, duration: 0.3, type: "triangle", volume: 0.12, delay: 0.18 }
  ],
  error: [{ start: 150, end: 110, duration: 0.16, type: "square", volume: 0.1 }]
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

const playTone = (context, tone) => {
  const now = context.currentTime + (tone.delay || 0);
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = tone.type;
  oscillator.frequency.setValueAtTime(tone.start, now);
  oscillator.frequency.exponentialRampToValueAtTime(tone.end, now + tone.duration);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(tone.filter || 2200, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(tone.volume || 0.06, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);

  oscillator.connect(filter).connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + tone.duration + 0.02);
};

export const playUiSound = (kind) => {
  const context = getAudioContext();
  if (!context) return;
  (profiles[kind] || profiles.select).forEach((tone) => playTone(context, tone));
};

export const playGameplaySounds = (message) => {
  if (!message) return;
  if (message.includes("Fim de jogo")) {
    playUiSound("gameOver");
    return;
  }
  if (message.includes("Power-up") || message.includes("Vida extra") || message.includes("ativada") || message.includes("Baú aberto")) playUiSound("pickup");
  if (message.includes("Inimigo derrotado")) playUiSound("defeat");
  else if (message.includes("Inimigo atingido")) playUiSound("hit");
  if (message.includes("atacou Supimpus")) playUiSound("enemyAttack");
  if (message.includes("Uma vida foi perdida")) playUiSound("damage");
  if (message.includes("Supimpus avançou")) playUiSound("move");
  if (message.includes("avançou.") && !message.includes("Supimpus")) playUiSound("enemyMove");
  if (message.includes("Bloqueado") || message.includes("bloqueia o caminho")) playUiSound("blocked");
  if (message.includes("lançado")) playUiSound("cast");
};
