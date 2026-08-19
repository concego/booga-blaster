const ALL_ELEMENTS = ["fire", "water", "earth", "air"];

export const COMMON_ENEMIES = Object.freeze({
  goblin: Object.freeze({ id: "goblin", name: "Goblin", hp: 1, role: "common" }),
  wolf: Object.freeze({ id: "wolf", name: "Lobo", hp: 1, role: "common" }),
  spider: Object.freeze({ id: "spider", name: "Aranha", hp: 1, role: "common" }),
  skeleton: Object.freeze({ id: "skeleton", name: "Esqueleto", hp: 1, role: "common" }),
  orc: Object.freeze({ id: "orc", name: "Orc", hp: 2, role: "heavy" }),
  bat: Object.freeze({ id: "bat", name: "Morcego", hp: 1, role: "common" })
});

export const BIOME_ENEMIES = Object.freeze({
  "thorn-beast": Object.freeze({ id: "thorn-beast", name: "Fera Espinhosa", hp: 2, role: "special" })
});

export const BIOME_CATALOG = Object.freeze({
  bosque: Object.freeze({
    id: "bosque",
    name: "Bosque",
    variants: ["clareira", "mata fechada", "caminho sinuoso", "bosque úmido"],
    commonEnemies: ["goblin", "wolf", "spider"],
    biomeEnemies: ["thorn-beast"],
    blockThemes: ["wood", "thorn", "moss"],
    powerupPool: ["ghost-potion", "super-strength", "bad-news", "salamander"],
    bossPool: ["forest-warden"]
  }),
  // Alias para sementes e URLs antigas do protótipo.
  "floresta-espinhosa": Object.freeze({
    id: "bosque",
    name: "Bosque",
    variants: ["clareira", "mata fechada", "caminho sinuoso", "bosque úmido"],
    commonEnemies: ["goblin", "wolf", "spider"],
    biomeEnemies: ["thorn-beast"],
    blockThemes: ["wood", "thorn", "moss"],
    powerupPool: ["ghost-potion", "super-strength", "bad-news", "salamander"],
    bossPool: ["forest-warden"]
  })
});

export const PHASE_CONTENT = Object.freeze({
  1: Object.freeze({
    level: 1,
    enemyCount: 3,
    specialEnemyCount: 0,
    allowedElements: ["fire"],
    allowedPowerups: ["super-strength", "bad-news", "extra-life"],
    specialRules: [],
    blockThemes: ["wood"]
  }),
  2: Object.freeze({
    level: 2,
    enemyCount: 4,
    specialEnemyCount: 1,
    allowedElements: ["fire", "water"],
    allowedPowerups: ["super-strength", "bad-news", "extra-life", "ghost-potion", "salamander"],
    specialRules: ["water-push-introduction"],
    blockThemes: ["wood", "thorn"]
  }),
  3: Object.freeze({
    level: 3,
    enemyCount: 5,
    specialEnemyCount: 1,
    allowedElements: ["fire", "water", "earth"],
    allowedPowerups: ["super-strength", "bad-news", "extra-life", "ghost-potion", "salamander", "mole"],
    specialRules: ["earth-stun-introduction"],
    blockThemes: ["wood", "thorn", "moss"]
  }),
  4: Object.freeze({
    level: 4,
    enemyCount: 5,
    specialEnemyCount: 2,
    allowedElements: ALL_ELEMENTS,
    allowedPowerups: ["super-strength", "bad-news", "extra-life", "ghost-potion", "salamander", "mole"],
    specialRules: ["elemental-blocks", "elemental-combinations"],
    blockThemes: ["wood", "thorn", "moss", "elemental"]
  })
});

const clone = (value) => JSON.parse(JSON.stringify(value));

export const getPhaseContent = ({ level = 1, biome = "bosque" } = {}) => {
  const phaseKey = Math.max(1, Math.min(4, Number(level) || 1));
  const phase = PHASE_CONTENT[phaseKey];
  const biomeData = BIOME_CATALOG[biome] || BIOME_CATALOG.bosque;
  return {
    ...clone(phase),
    biome: clone(biomeData),
    level: Number(level) >= 4 ? Number(level) : phase.level,
    allowedElements: [...(Number(level) >= 4 ? ALL_ELEMENTS : phase.allowedElements)],
    allowedPowerups: [...phase.allowedPowerups],
    blockThemes: [...new Set([...phase.blockThemes, ...biomeData.blockThemes])]
  };
};
