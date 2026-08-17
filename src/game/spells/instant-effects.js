import { adjacentCells } from "./area-effects.js?v=svg-test-03";
import { isBlocked } from "../../core/grid.js?v=svg-test-03";
import { STONE_DAMAGE, damageEnemyAt } from "../combat/damage.js?v=svg-test-03";

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
    const result = damageEnemyAt(state, cell, STONE_DAMAGE);
    if (result.hit && result.enemy) result.enemy.stunned = Math.max(result.enemy.stunned || 0, 1);
  });
};
