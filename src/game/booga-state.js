import { POWERUP_SOURCES } from "./powerups/powerup-sources.js?v=svg-test-38";
import { POWERUP_TYPES } from "./powerups/powerup-catalog.js?v=svg-test-38";
import { createPowerupItem } from "./powerups/powerup-sources.js?v=svg-test-38";
import { createHeartItem } from "./collectibles/heart-items.js?v=svg-test-38";
import { generateLevel } from "./level-generator.js?v=svg-test-38";

const ELEMENT_NAMES = { fire: "Fogo", water: "Água", earth: "Terra", air: "Ar" };

export const createBoogaState = ({
  testElements = false,
  seed = Date.now(),
  difficulty = 1,
  biome = "floresta-espinhosa"
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
    player: { ...level.start },
    goal: { ...level.goal },
    lives: 3,
    hearts: 3,
    gameOver: false,
    selectedElement: "fire",
    unlockedElements: getElementsForLevel(difficulty, testElements),
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
      "Supimpus entrou no Bosque Espinhoso.",
      "Fogo selecionado.",
      `Fase ${difficulty} gerada no bioma ${level.biome}. Semente: ${level.seed}.`,
      `Objetivo: alcançar o Boss. Elementos disponíveis: ${level.availableElements.map((element) => ELEMENT_NAMES[element]).join(", ")}.`
    ]
  };
};
