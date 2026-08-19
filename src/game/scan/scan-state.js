import { getPowerup } from "../powerups/powerup-catalog.js?v=svg-test-43";
import { getBlockAt } from "../../core/grid.js?v=svg-test-43";

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
