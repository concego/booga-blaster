import { POWERUP_SOURCES } from "./powerups/powerup-sources.js?v=svg-test-79";
import { POWERUP_TYPES } from "./powerups/powerup-catalog.js?v=svg-test-79";
import { createPowerupItem } from "./powerups/powerup-sources.js?v=svg-test-79";
import { createHeartItem } from "./collectibles/heart-items.js?v=svg-test-79";
import { generateLevel } from "./level-generator.js?v=svg-test-79";

const ELEMENT_NAMES = { fire: "Fogo", water: "Água", earth: "Terra", air: "Ar" };

export const createBoogaState = ({
  testElements = false,
  seed = Date.now(),
  difficulty = 1,
  biome = "bosque"
} = {}) => {
  const level = generateLevel({ seed, difficulty, biome, testElements });
  const powerups = level.powerups.map((item) => createPowerupItem(
    item.type,
    item.source,
    item.position,
    item.id
  ));
  const heartItems = level.heartItems.map((item) => createHeartItem(
    item.source,
    item.position,
    item.id
  ));

  return {
    turn: 0,
    seed: level.seed,
    difficulty,
    biome: level.biome,
    biomeName: level.biomeName,
    biomeVariant: level.biomeVariant,
    phaseName: `Fase ${difficulty} — ${level.biomeName}`,
    currentPhase: difficulty,
    campaignSeed: seed,
    arenaMode: "normal",
    specialEnemy: null,
    summonedEnemyIds: [],
    webs: [],
    phaseComplete: false,
    player: { ...level.start },
    goal: { ...level.goal },
    lives: 3,
    hearts: 3,
    gameOver: false,
    selectedElement: "fire",
    unlockedElements: [...level.availableElements],
    launchArmed: false,
    effects: [],
    effectsRevision: 0,
    badNewsPhase: 0,
    zones: [],
    projectiles: [],
    enemies: level.enemies,
    orbs: [],
    powerups,
    heartItems,
    chests: level.chests,
    grid: { width: 9, height: 5, cells: level.cells, blocks: level.blocks },
    log: [
      `Supimpus entrou no ambiente ${level.biomeName}.`,
      "Fogo selecionado.",
      `Fase ${difficulty} gerada no ${level.biomeName}, variação ${level.biomeVariant}. Semente: ${level.seed}.`,
      `Objetivo: alcançar a arena do inimigo especial. Elementos disponíveis: ${level.availableElements.map((element) => ELEMENT_NAMES[element]).join(", ")}.`
    ]
  };
};
