const ALL_ELEMENTS = ["fire", "water", "earth", "air"];
export const TOTAL_PHASES = 21;
export const ENVIRONMENT_COUNT = 7;
export const PHASES_PER_ENVIRONMENT = 3;

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

export const ENVIRONMENT_CATALOG = Object.freeze({
  floresta: Object.freeze({ id: "floresta", name: "Floresta" }),
  subterraneo: Object.freeze({ id: "subterraneo", name: "Subterrâneo" }),
  planicie: Object.freeze({ id: "planicie", name: "Planície" }),
  vale: Object.freeze({ id: "vale", name: "Vale" }),
  montanha: Object.freeze({ id: "montanha", name: "Montanha" }),
  castelo: Object.freeze({ id: "castelo", name: "Castelo" }),
  "torre-de-magia": Object.freeze({ id: "torre-de-magia", name: "Torre de magia" })
});

export const getEnvironmentForPhase = ({ level = 1 } = {}) => {
  const numericLevel = Math.min(TOTAL_PHASES, Math.max(1, Number(level) || 1));
  const environmentIndex = Math.ceil(numericLevel / PHASES_PER_ENVIRONMENT);
  return Object.values(ENVIRONMENT_CATALOG)[environmentIndex - 1];
};

export const PHASE_CONTENT = Object.freeze({
  1: Object.freeze({
    level: 1,
    enemyCount: 3,
    specialEnemyCount: 1,
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
    enemyCount: 6,
    specialEnemyCount: 1,
    allowedElements: ALL_ELEMENTS,
    allowedPowerups: ["super-strength", "bad-news", "extra-life", "ghost-potion", "salamander", "mole"],
    specialRules: ["elemental-blocks", "elemental-combinations"],
    blockThemes: ["wood", "thorn", "moss", "elemental"]
  })
});

const clone = (value) => JSON.parse(JSON.stringify(value));

export const getPhaseContent = ({ level = 1, biome = "bosque" } = {}) => {
  const numericLevel = Math.min(TOTAL_PHASES, Math.max(1, Number(level) || 1));
  const phaseKey = Math.min(4, numericLevel);
  const environment = getEnvironmentForPhase({ level: numericLevel });
  const environmentIndex = Math.ceil(numericLevel / PHASES_PER_ENVIRONMENT);
  const phaseInEnvironment = ((numericLevel - 1) % PHASES_PER_ENVIRONMENT) + 1;
  const phase = clone(PHASE_CONTENT[phaseKey]);
  const baseBiome = BIOME_CATALOG[biome] || BIOME_CATALOG.bosque;
  const biomeData = {
    ...clone(baseBiome),
    id: environment.id,
    name: environment.name
  };
  const scaledEnemyCount = Math.min(8, 2 + numericLevel);
  return {
    ...phase,
    biome: clone(biomeData),
    level: numericLevel,
    environmentIndex,
    phaseInEnvironment,
    enemyCount: scaledEnemyCount,
    specialEnemyCount: 1,
    isBossPhase: phaseInEnvironment === PHASES_PER_ENVIRONMENT,
    allowedElements: [...(numericLevel >= 4 ? ALL_ELEMENTS : phase.allowedElements)],
    allowedPowerups: [...phase.allowedPowerups],
    blockThemes: [...new Set([...phase.blockThemes, ...biomeData.blockThemes])]
  };
};

export const getPhaseBossId = ({ level = 1 } = {}) => {
  const numericLevel = Math.min(TOTAL_PHASES, Math.max(1, Number(level) || 1));
  const phaseInEnvironment = ((numericLevel - 1) % PHASES_PER_ENVIRONMENT) + 1;
  return phaseInEnvironment === PHASES_PER_ENVIRONMENT ? "forest-warden" : null;
};
