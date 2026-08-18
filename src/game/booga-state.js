import { createDemoEnemies } from "./demo-fixtures.js?v=svg-test-27";
import { POWERUP_SOURCES } from "./powerups/powerup-sources.js?v=svg-test-27";
import { POWERUP_TYPES } from "./powerups/powerup-catalog.js?v=svg-test-27";
import { createPowerupItem } from "./powerups/powerup-sources.js?v=svg-test-27";

const createCells = () => [
  ["#", ".", ".", ".", "#", ".", ".", ".", "#"],
  [".", ".", "#", ".", ".", ".", "#", ".", "."],
  [".", ".", ".", ".", "#", ".", ".", ".", "."],
  [".", "#", ".", ".", ".", ".", ".", "#", "."],
  ["#", ".", ".", ".", "#", ".", ".", ".", "#"]
];

export const createBoogaState = ({ testElements = false } = {}) => {
  const chestPowerup = createPowerupItem(
    POWERUP_TYPES.SALAMANDER,
    POWERUP_SOURCES.CHEST,
    { x: 2, y: 0 },
    "chest-salamander"
  );
  const blockPowerup = createPowerupItem(
    POWERUP_TYPES.EXTRA_LIFE,
    POWERUP_SOURCES.BLOCK_CONTENT,
    { x: 4, y: 0 },
    "block-extra-life"
  );

  return {
    turn: 0,
    player: { x: 1, y: 1 },
    lives: 3,
    hearts: 3,
    gameOver: false,
    selectedElement: "fire",
    unlockedElements: testElements ? ["fire", "water", "earth", "air"] : ["fire"],
    launchArmed: false,
    effects: [],
    effectsRevision: 0,
    zones: [],
    projectiles: [],
    enemies: createDemoEnemies({ durable: testElements }),
    orbs: [],
    powerups: [
      createPowerupItem(POWERUP_TYPES.SUPER_STRENGTH, POWERUP_SOURCES.MAP, { x: 1, y: 0 }),
      chestPowerup,
      blockPowerup
    ],
    chests: [{ id: "forest-chest", x: 2, y: 0, contents: chestPowerup.id, opened: false }],
    grid: { width: 9, height: 5, cells: createCells() },
    log: [
      "Supimpus entrou no Bosque Espinhoso.",
      "Fogo selecionado.",
      "Há caminhos livres ao norte e a leste.",
      "O objetivo é alcançar o Boss da fase."
    ]
  };
};
