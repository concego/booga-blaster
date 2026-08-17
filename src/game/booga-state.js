import { createDemoEnemies } from "./demo-fixtures.js?v=svg-test-16";

const createCells = () => [
  ["#", ".", ".", ".", "#", ".", ".", ".", "#"],
  [".", ".", "#", ".", ".", ".", "#", ".", "."],
  [".", ".", ".", ".", "#", ".", ".", ".", "."],
  [".", "#", ".", ".", ".", ".", ".", "#", "."],
  ["#", ".", ".", ".", "#", ".", ".", ".", "#"]
];

export const createBoogaState = () => ({
  turn: 0,
  player: { x: 1, y: 1 },
  lives: 3,
  hearts: 3,
  gameOver: false,
  selectedElement: "fire",
  unlockedElements: ["fire"],
  launchArmed: false,
  effects: [],
  effectsRevision: 0,
  zones: [],
  enemies: createDemoEnemies(),
  orbs: [],
  powerups: [],
  grid: { width: 9, height: 5, cells: createCells() },
  log: [
    "Supimpus entrou no Bosque Espinhoso.",
    "Fogo selecionado.",
    "Há caminhos livres ao norte e a leste.",
    "O objetivo é alcançar o Boss da fase."
  ]
});
