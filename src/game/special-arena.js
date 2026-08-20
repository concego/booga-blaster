import { getSpecialEnemyForPhase } from "./special-enemies.js?v=svg-test-76";

const ARENA_WIDTH = 9;
const ARENA_HEIGHT = 5;
const keyOf = ({ x, y }) => `${x},${y}`;

const createArenaBlocks = (special) => {
  if (special.behavior !== "break-blocks") return [];
  return [
    { x: 3, y: 1, theme: "wood", color: null, immuneTo: [] },
    { x: 5, y: 1, theme: "thorn", color: null, immuneTo: [] },
    { x: 3, y: 3, theme: "moss", color: null, immuneTo: [] },
    { x: 5, y: 3, theme: "wood", color: null, immuneTo: [] }
  ];
};

export const enterSpecialArena = (state) => {
  const special = getSpecialEnemyForPhase(state.difficulty);
  if (!special) return null;

  const blocks = createArenaBlocks(special);
  const blockKeys = new Set(blocks.map(keyOf));
  const cells = Array.from({ length: ARENA_HEIGHT }, (_, y) => (
    Array.from({ length: ARENA_WIDTH }, (_, x) => (blockKeys.has(`${x},${y}`) ? "#" : "."))
  ));

  state.arenaMode = "special";
  state.specialEnemy = special;
  state.phaseName = `Arena: ${special.name}`;
  state.goal = null;
  state.player = { x: 1, y: 2, stunned: 0 };
  state.enemies = [{ ...special, x: 7, y: 2 }];
  state.summonedEnemyIds = [];
  state.webs = [];
  state.grid = { width: ARENA_WIDTH, height: ARENA_HEIGHT, cells, blocks };
  state.projectiles = [];
  state.zones = [];
  state.chests = [];
  state.powerups = [];
  state.heartItems = [];
  return `Objetivo alcançado. Supimpus entrou na arena de ${special.name}. ${special.personality}`;
};

export const isSpecialArena = (state) => state.arenaMode === "special";
