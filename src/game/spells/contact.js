import { getDirection } from "../../core/directions.js";
import { isInsideGrid } from "../../core/grid.js";

const findEnemy = (state, x, y) => state.enemies.find((enemy) => enemy.x === x && enemy.y === y);

export const findContactCell = (state, directionName, range) => {
  const direction = getDirection(directionName);
  if (!direction) return { ok: false, message: "Direção inválida." };

  let contact = { x: state.player.x, y: state.player.y };
  for (let step = 1; step <= range; step += 1) {
    const x = state.player.x + direction.dx * step;
    const y = state.player.y + direction.dy * step;
    if (!isInsideGrid(state, x, y)) break;
    contact = { x, y };
    const enemy = findEnemy(state, x, y);
    if (state.grid.cells[y][x] === "#" || enemy) {
      return { ok: true, contact, enemy, blocked: state.grid.cells[y][x] === "#" };
    }
  }

  return { ok: true, contact, enemy: findEnemy(state, contact.x, contact.y), blocked: false };
};

export const destroyContactBlock = (state, contact) => {
  if (state.grid.cells[contact.y][contact.x] !== "#") return false;
  state.grid.cells[contact.y][contact.x] = ".";
  return true;
};
