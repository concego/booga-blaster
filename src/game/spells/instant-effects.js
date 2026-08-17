import { adjacentCells } from "./area-effects.js";
import { isBlocked } from "../../core/grid.js";

const enemyAt = (state, cell) => state.enemies.find((enemy) => enemy.x === cell.x && enemy.y === cell.y);

export const pushEnemies = (state, contact, direction) => {
  state.enemies.forEach((enemy) => {
    if (enemy.x !== contact.x || enemy.y !== contact.y) return;
    const destination = { x: enemy.x + direction.dx, y: enemy.y + direction.dy };
    if (!isBlocked(state, destination.x, destination.y) && !enemyAt(state, destination)) {
      enemy.x = destination.x;
      enemy.y = destination.y;
    }
  });
};

export const throwStones = (state, contact) => {
  adjacentCells(state, contact).forEach((cell) => {
    const enemy = enemyAt(state, cell);
    if (enemy) enemy.stunned = Math.max(enemy.stunned || 0, 1);
  });
};
