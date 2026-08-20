import { isBlocked } from "../../core/grid.js?v=svg-test-75";
import { STONE_DAMAGE, damageEnemyAt } from "../combat/damage.js?v=svg-test-75";

const enemyAt = (state, cell) => state.enemies.find((enemy) => enemy.x === cell.x && enemy.y === cell.y);

export const pushEnemies = (state, cells, direction) => {
  let moved = 0;
  cells.forEach((cell) => {
    state.enemies.forEach((enemy) => {
      if (enemy.x !== cell.x || enemy.y !== cell.y) return;
      const destination = { x: enemy.x + direction.dx, y: enemy.y + direction.dy };
      const occupiedByPlayer = state.player.x === destination.x && state.player.y === destination.y;
      if (!isBlocked(state, destination.x, destination.y) && !enemyAt(state, destination) && !occupiedByPlayer) {
        enemy.x = destination.x;
        enemy.y = destination.y;
        moved += 1;
      }
    });
  });
  return moved;
};

export const throwStones = (state, cells) => {
  let hit = 0;
  cells.forEach((cell) => {
    const result = damageEnemyAt(state, cell, STONE_DAMAGE);
    if (!result.hit || !result.enemy || result.resisted) return;
    hit += 1;
    result.enemy.stunned = Math.max(result.enemy.stunned || 0, 1);
  });
  return hit;
};
