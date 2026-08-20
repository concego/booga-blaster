import { getPowerup } from "../powerups/powerup-catalog.js?v=svg-test-57";
import { getBlockAt } from "../../core/grid.js?v=svg-test-57";

const elementNames = { fire: "Fogo", water: "Água", earth: "Terra", air: "Ar" };

const SCAN_RADIUS = 5;
const locationOf = (player, x, y) => {
  const dx = x - player.x;
  const dy = y - player.y;
  const distance = Math.abs(dx) + Math.abs(dy);
  if (distance === 0) return "Aqui";

  const parts = [];
  if (dy !== 0) parts.push(`${Math.abs(dy)}${dy > 0 ? "S" : "N"}`);
  if (dx !== 0) parts.push(`${Math.abs(dx)}${dx > 0 ? "L" : "O"}`);
  return parts.join(", ");
};

const addFinding = (findings, name, player, x, y) => {
  const distance = Math.abs(x - player.x) + Math.abs(y - player.y);
  if (distance < SCAN_RADIUS + 1) findings.push(`${name}: ${locationOf(player, x, y)}`);
};

const adjacentDirections = [
  { dx: 0, dy: -1, label: "norte" },
  { dx: 0, dy: 1, label: "sul" },
  { dx: -1, dy: 0, label: "oeste" },
  { dx: 1, dy: 0, label: "leste" }
];

const adjacentNameAt = (state, x, y) => {
  const enemy = state.enemies.find((item) => item.x === x && item.y === y);
  if (enemy) return enemy.name;
  if (state.chests.some((item) => !item.opened && item.x === x && item.y === y)) return "baú";
  const powerup = state.powerups.find((item) => item.revealed && !item.collected && item.x === x && item.y === y);
  if (powerup) return getPowerup(powerup.type)?.name || "power-up";
  if (state.heartItems.some((item) => item.revealed && !item.collected && item.x === x && item.y === y)) return "coração";
  if (state.projectiles.some((item) => item.cell.x === x && item.cell.y === y)) return "projétil";
  if (state.webs?.some((web) => web.x === x && web.y === y)) return "teia";
  if (state.zones.some((zone) => zone.cells.some((cell) => cell.x === x && cell.y === y))) return "efeito elemental";
  if (state.goal?.x === x && state.goal?.y === y) return "objetivo";
  if (state.grid.cells[y]?.[x] === "#") {
    const block = getBlockAt(state, x, y);
    return block?.color ? `bloco de ${elementNames[block.color]}` : "bloco";
  }
  return null;
};

export const getAdjacentFindings = (state) => {
  const { player } = state;
  const findings = [];
  adjacentDirections.forEach(({ dx, dy, label }) => {
    const x = player.x + dx;
    const y = player.y + dy;
    if (x < 0 || y < 0 || x >= state.grid.width || y >= state.grid.height) return;
    const name = adjacentNameAt(state, x, y);
    if (name) findings.push(`${name} ao ${label}`);
  });
  return findings;
};

export const scanState = (state) => {
  const findings = [];
  const { player, grid } = state;

  grid.cells.forEach((row, y) => row.forEach((value, x) => {
    if (value !== "#") return;
    const block = getBlockAt(state, x, y);
    const immunity = block?.immuneTo?.length
      ? ` resistente a ${block.immuneTo.map((element) => elementNames[element]).join(" e ")}`
      : "";
    const color = block?.color ? ` ${elementNames[block.color] || block.color}` : "";
    addFinding(findings, `Bloco${color}${immunity}`, player, x, y);
  }));
  state.enemies.forEach((enemy) => addFinding(findings, enemy.name, player, enemy.x, enemy.y));
  state.zones.forEach((zone) => zone.cells.forEach((cell) => {
    const name = zone.type === "flame" ? "Chama" : "Barreira de ar";
    addFinding(findings, name, player, cell.x, cell.y);
  }));
  state.chests.filter((chest) => !chest.opened).forEach((chest) => {
    addFinding(findings, "Baú", player, chest.x, chest.y);
  });
  state.powerups.filter((item) => item.revealed && !item.collected).forEach((item) => {
    const powerup = getPowerup(item.type);
    if (powerup) addFinding(findings, powerup.name, player, item.x, item.y);
  });
  state.heartItems.filter((item) => item.revealed && !item.collected).forEach((item) => {
    addFinding(findings, "Coração", player, item.x, item.y);
  });

  const intro = `Escaneando de ${player.x}, ${player.y}...`;
  return {
    intro,
    findings,
    announcement: findings.length ? findings.join(". ") : "Nada próximo."
  };
};
