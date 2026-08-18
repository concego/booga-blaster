import { getDirection } from "../../core/directions.js?v=svg-test-25";
import { isInsideGrid } from "../../core/grid.js?v=svg-test-25";

const findEnemy = (state, x, y) => state.enemies.find((enemy) => enemy.x === x && enemy.y === y);

export const findContactCell = (state, directionName, range) => {
  const direction = getDirection(directionName);
  if (!direction) return { ok: false, message: "Direção inválida." };

  let projectile = { x: state.player.x, y: state.player.y };
  let contact = projectile;
  for (let step = 1; step <= range; step += 1) {
    const x = state.player.x + direction.dx * step;
    const y = state.player.y + direction.dy * step;
    if (!isInsideGrid(state, x, y)) break;

    contact = { x, y };
    const enemy = findEnemy(state, x, y);
    if (state.grid.cells[y][x] === "#") {
      return { ok: true, contact, projectile, enemy: null, blocked: true };
    }
    projectile = contact;
    if (enemy) return { ok: true, contact, projectile, enemy, blocked: false };
  }

  return { ok: true, contact: projectile, projectile, enemy: findEnemy(state, projectile.x, projectile.y), blocked: false };
};
