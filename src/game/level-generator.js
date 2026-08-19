import { COMMON_ENEMIES, BIOME_ENEMIES, getPhaseContent } from "./content-catalog.js?v=svg-test-43";

const WIDTH = 9;
const HEIGHT = 5;
const START = Object.freeze({ x: 1, y: 1 });
const GOAL = Object.freeze({ x: 7, y: 3 });

export const getElementsForLevel = (level = 1, testElements = false) => {
  if (testElements) return ["fire", "water", "earth", "air"];
  if (level >= 4) return ["fire", "water", "earth", "air"];
  if (level === 3) return ["fire", "water", "earth"];
  if (level === 2) return ["fire", "water"];
  return ["fire"];
};

const sameCell = (a, b) => a.x === b.x && a.y === b.y;
const keyOf = ({ x, y }) => `${x},${y}`;

const hashSeed = (seed) => {
  const text = String(seed ?? "booga-blaster");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const random = (seed) => {
  let value = hashSeed(seed);
  return () => {
    value += 0x6D2B79F5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};

const neighbours = ({ x, y }) => [
  { x: x, y: y - 1 },
  { x: x, y: y + 1 },
  { x: x - 1, y },
  { x: x + 1, y }
];

const criticalRoute = () => [
  START,
  { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
  { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
  { x: 7, y: 1 }, { x: 7, y: 2 }, GOAL
];

const shuffle = (items, rng) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
};

const createCells = (rng) => {
  const route = new Set(criticalRoute().map(keyOf));
  const protectedCells = new Set([
    keyOf(START), keyOf({ x: 1, y: 0 }), keyOf({ x: 2, y: 1 }), keyOf(GOAL)
  ]);
  const cells = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill("."));
  const candidates = [];

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const cell = { x, y };
      if (!route.has(keyOf(cell)) && !protectedCells.has(keyOf(cell))) candidates.push(cell);
    }
  }

  shuffle(candidates, rng).slice(0, 8 + Math.floor(rng() * 4)).forEach(({ x, y }) => {
    cells[y][x] = "#";
  });
  return cells;
};

const reachableFrom = (cells, origin) => {
  const visited = new Set([keyOf(origin)]);
  const queue = [origin];
  while (queue.length) {
    const current = queue.shift();
    neighbours(current).forEach((cell) => {
      if (cell.x < 0 || cell.y < 0 || cell.x >= WIDTH || cell.y >= HEIGHT) return;
      if (cells[cell.y][cell.x] === "#") return;
      const key = keyOf(cell);
      if (visited.has(key)) return;
      visited.add(key);
      queue.push(cell);
    });
  }
  return visited;
};

const countOpenExits = (cells, origin) => neighbours(origin).filter((cell) => (
  cell.x >= 0 && cell.y >= 0 && cell.x < WIDTH && cell.y < HEIGHT && cells[cell.y][cell.x] !== "#"
)).length;

const isValidLayout = (cells) => {
  const reachable = reachableFrom(cells, START);
  return reachable.has(keyOf(GOAL)) && countOpenExits(cells, START) >= 2 && reachable.size >= 24;
};

const freeCells = (cells, reserved = new Set()) => {
  const result = [];
  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const cell = { x, y };
      if (cells[y][x] !== "#" && !reserved.has(keyOf(cell))) result.push(cell);
    }
  }
  return result;
};

const takeCell = (pool, reserved, predicate = () => true) => {
  const index = pool.findIndex((cell) => !reserved.has(keyOf(cell)) && predicate(cell));
  if (index < 0) return null;
  const [cell] = pool.splice(index, 1);
  reserved.add(keyOf(cell));
  return cell;
};

const createBlocks = (cells, content, rng) => {
  const positions = [];
  cells.forEach((row, y) => row.forEach((value, x) => {
    if (value === "#") positions.push({ x, y });
  }));
  const elemental = content.specialRules.includes("elemental-blocks");
  const elements = ["fire", "water", "earth", "air"];
  return shuffle(positions, rng).map((position, index) => {
    if (!elemental || index < 2) {
      return { ...position, theme: content.blockThemes[index % content.blockThemes.length], color: null, immuneTo: [] };
    }
    const element = elements[index % elements.length];
    return {
      ...position,
      theme: "elemental",
      color: element,
      immuneTo: [element]
    };
  });
};

const createEnemies = (cells, rng, content, testElements, reserved) => {
  const count = testElements ? 5 : content.enemyCount;
  const pool = shuffle(freeCells(cells), rng);
  const ids = shuffle([...content.biome.commonEnemies, ...content.biome.biomeEnemies], rng);
  const templates = ids.map((id) => COMMON_ENEMIES[id] || BIOME_ENEMIES[id]).filter(Boolean);
  while (templates.length < count && templates.length > 0) {
    templates.push(templates[templates.length % ids.length]);
  }
  const enemies = [];

  templates.slice(0, count).forEach((template, index) => {
    const cell = takeCell(pool, reserved, (candidate) => (
      Math.abs(candidate.x - START.x) + Math.abs(candidate.y - START.y) >= 3 &&
      Math.abs(candidate.x - GOAL.x) + Math.abs(candidate.y - GOAL.y) >= 2
    ));
    if (!cell) return;
    const hp = testElements && template.hp === 1 ? 2 : template.hp;
    enemies.push({
      id: `enemy-${template.id}-${index}`,
      name: template.name,
      ...cell,
      hp,
      maxHp: hp,
      stunned: 0,
      ...(template.id === "goblin" ? { drop: "ghost-potion" } : {}),
      ...(template.id === "wolf" ? { heartDrop: true } : {})
    });
  });
  return enemies;
};

export const validateGeneratedLevel = (level) => {
  const reachable = reachableFrom(level.cells, level.start);
  const occupied = [
    ...level.enemies,
    ...level.powerups.filter((item) => item.source !== "chest").map((item) => item.position),
    ...level.heartItems.filter((item) => item.source !== "chest").map((item) => item.position),
    ...level.chests
  ];
  const uniqueOccupied = new Set(occupied.map(keyOf));
  return {
    valid: reachable.has(keyOf(level.goal)) && countOpenExits(level.cells, level.start) >= 2 &&
      uniqueOccupied.size === occupied.length,
    reachableCells: reachable.size,
    openExits: countOpenExits(level.cells, level.start)
  };
};

export const generateLevel = ({ seed = Date.now(), difficulty = 1, biome = "floresta-espinhosa", testElements = false } = {}) => {
  const content = getPhaseContent({ level: difficulty, biome });
  const rng = random(seed);
  let cells = null;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = createCells(rng);
    if (isValidLayout(candidate)) {
      cells = candidate;
      break;
    }
  }
  if (!cells) throw new Error("Não foi possível gerar uma fase válida.");

  const contentBlocks = createBlocks(cells, content, rng);
  const reserved = new Set([keyOf(START), keyOf(GOAL)]);
  const pool = shuffle(freeCells(cells, reserved), rng);
  const mapSuperStrength = takeCell(pool, reserved);
  const mapBadNews = takeCell(pool, reserved);
  const mapHeart = takeCell(pool, reserved);
  const chestCell = takeCell(pool, reserved);
  const heartChestCell = takeCell(pool, reserved);
  const blockCell = contentBlocks[0];
  const enemies = createEnemies(cells, rng, content, testElements, reserved);
  const chestPowerupType = content.allowedPowerups.includes("salamander") ? "salamander" : "ghost-potion";
  const chestPowerupId = `chest-${chestPowerupType}`;
  const chestHeartId = "chest-heart";

  const level = {
    seed,
    phaseLevel: content.level,
    biome: content.biome.id,
    availableElements: testElements ? ["fire", "water", "earth", "air"] : content.allowedElements,
    start: { ...START },
    goal: { ...GOAL },
    cells,
    blocks: contentBlocks,
    enemies,
    powerups: [
      { type: "super-strength", source: "map", position: mapSuperStrength },
      { type: "bad-news", source: "map", position: mapBadNews },
      { type: chestPowerupType, source: "chest", position: chestCell, id: chestPowerupId },
      { type: "extra-life", source: "block-content", position: blockCell }
    ],
    heartItems: [
      { source: "map", position: mapHeart, id: "map-heart" },
      { source: "chest", position: heartChestCell, id: chestHeartId }
    ],
    chests: [
      { id: "forest-chest", ...chestCell, contents: chestPowerupId, opened: false },
      { id: "heart-chest", ...heartChestCell, contents: chestHeartId, opened: false }
    ]
  };
  const validation = validateGeneratedLevel(level);
  if (!validation.valid) throw new Error("O gerador produziu uma fase inválida.");
  return level;
};