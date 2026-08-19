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

const fileProfiles = Object.freeze({
  confirm: { file: "ui-confirm.ogg", volume: 0.42 },
  select: { file: "ui-select.ogg", volume: 0.38 },
  "cast-fire": { file: "spell-fire-launch.ogg", volume: 0.5 },
  "cast-water": { file: "spell-water-launch.mp3", volume: 0.42 },
  "cast-earth": { file: "spell-earth-launch.mp3", volume: 0.42 },
  "cast-air": { file: "spell-air-launch.mp3", volume: 0.42 },
  explosion: { file: "spell-explosion.mp3", volume: 0.42 },
  hit: { file: "enemy-impact.mp3", volume: 0.4 },
  defeat: { file: "enemy-defeat.ogg", volume: 0.52 },
  pickup: { file: "item-pickup.ogg", volume: 0.48 },
  blocked: { file: "block-stone.ogg", volume: 0.42 },
  damage: { file: "enemy-hurt.ogg", volume: 0.5 }
});

const fileAudioCache = new Map();

const playFileSound = (kind) => {
  const profile = fileProfiles[kind];
  if (!profile || typeof window.Audio !== "function") return false;
  let audio = fileAudioCache.get(kind);
  if (!audio) {
    audio = new Audio(new URL(`../../audio/${profile.file}`, import.meta.url).href);
    audio.preload = "auto";
    audio.volume = profile.volume;
    fileAudioCache.set(kind, audio);
  }
  audio.currentTime = 0;
  const promise = audio.play();
  if (promise?.catch) promise.catch(() => {});
  return true;
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

  const output = tone.pan === undefined ? context.destination : context.createStereoPanner();
  if (tone.pan !== undefined) {
    output.pan.setValueAtTime(tone.pan, now);
    gain.connect(output).connect(context.destination);
  } else {
    gain.connect(output);
  }
  oscillator.connect(filter).connect(gain);
  oscillator.start(now);
  oscillator.stop(now + tone.duration + 0.02);
};

export const playUiSound = (kind) => {
  if (playFileSound(kind)) return;
  const context = getAudioContext();
  if (!context) return;
  (profiles[kind] || profiles.select).forEach((tone) => playTone(context, tone));
};

const proximityTone = (state, dx, dy, distance) => {
  const x = state.player.x + dx;
  const y = state.player.y + dy;
  if (x < 0 || y < 0 || x >= state.grid.width || y >= state.grid.height) return null;
  const block = state.grid.cells[y][x] === "#";
  const enemy = state.enemies.find((item) => item.x === x && item.y === y);
  const chest = state.chests.some((item) => !item.opened && item.x === x && item.y === y);
  const powerup = state.powerups.some((item) => item.revealed && !item.collected && item.x === x && item.y === y);
  const heart = state.heartItems.some((item) => item.revealed && !item.collected && item.x === x && item.y === y);
  const goal = state.goal?.x === x && state.goal?.y === y;
  let tone = null;
  if (enemy) tone = enemy.maxHp > 1 ? { start: 90, end: 65, type: "sawtooth", maxDistance: 3 } : { start: 180, end: 130, type: "sawtooth", maxDistance: 3 };
  else if (powerup) tone = { start: 880, end: 700, type: "triangle", maxDistance: 1 };
  else if (heart) tone = { start: 600, end: 480, type: "triangle", maxDistance: 1 };
  else if (block) tone = { start: 150, end: 110, type: "square", maxDistance: 1 };
  else if (chest) tone = { start: 523, end: 440, type: "sine", maxDistance: 2 };
  else if (goal) tone = { start: 80, end: 55, type: "sawtooth", maxDistance: 3 };
  if (!tone || distance > tone.maxDistance) return null;
  return { ...tone, volume: Math.max(0.04, 0.22 - (distance - 1) * 0.06), pan: Math.max(-1, Math.min(1, dx / 3)) };
};

export const playEnvironmentSonar = (state) => {
  const context = getAudioContext();
  if (!context) return;
  playUiSound("move");
  const items = [];
  for (let dy = -3; dy <= 3; dy += 1) {
    for (let dx = -3; dx <= 3; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const distance = Math.abs(dx) + Math.abs(dy);
      const tone = proximityTone(state, dx, dy, distance);
      if (tone) items.push(tone);
    }
  }
  items.forEach((tone, index) => playTone(context, { ...tone, delay: index * 0.12 }));
};

const elementCastKinds = {
  fire: "cast-fire",
  water: "cast-water",
  earth: "cast-earth",
  air: "cast-air"
};

export const playGameplaySounds = (message, selectedElement = "fire") => {
  if (!message) return;
  if (message.includes("Fim de jogo")) {
    playUiSound("gameOver");
    return;
  }
  if (message.includes("Power-up") || message.includes("Vida extra") || message.includes("Coração encontrado") || message.includes("coração caiu") || message.includes("ativada") || message.includes("Baú aberto")) playUiSound("pickup");
  if (message.includes("explodiu")) playUiSound("explosion");
  if (message.includes("Inimigo derrotado")) playUiSound("defeat");
  else if (message.includes("Inimigo atingido")) playUiSound("hit");
  if (message.includes("atacou Supimpus")) playUiSound("enemyAttack");
  if (message.includes("Uma vida foi perdida")) playUiSound("damage");
  if (message.includes("Supimpus avançou")) playUiSound("move");
  if (message.includes("avançou.") && !message.includes("Supimpus")) playUiSound("enemyMove");
  if (message.includes("Bloqueado") || message.includes("bloqueia o caminho")) playUiSound("blocked");
  if (message.includes("lançado")) playUiSound(elementCastKinds[selectedElement] || "cast-fire");
};
