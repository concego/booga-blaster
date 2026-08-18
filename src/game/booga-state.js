import { POWERUP_SOURCES } from "./powerups/powerup-sources.js?v=svg-test-33";
import { POWERUP_TYPES } from "./powerups/powerup-catalog.js?v=svg-test-33";
import { createPowerupItem } from "./powerups/powerup-sources.js?v=svg-test-33";
import { createHeartItem } from "./collectibles/heart-items.js?v=svg-test-33";
import { generateLevel } from "./level-generator.js?v=svg-test-33";

export const createBoogaState = ({ testElements = false, seed = Date.now(), difficulty = 1 } = {}) => {
  const level = generateLevel({ seed, difficulty, testElements });
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
    player: { ...level.start },
    goal: { ...level.goal },
    lives: 3,
    hearts: 3,
    gameOver: false,
    selectedElement: "fire",
    unlockedElements: testElements ? ["fire", "water", "earth", "air"] : ["fire"],
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
    grid: { width: 9, height: 5, cells: level.cells },
    log: [
      "Supimpus entrou no Bosque Espinhoso.",
      "Fogo selecionado.",
      `Semente da fase: ${level.seed}.`,
      "O objetivo é alcançar o Boss da fase."
    ]
  };
};
