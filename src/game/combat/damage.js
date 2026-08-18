import { POWERUP_SOURCES, createPowerupItem } from "../powerups/powerup-sources.js?v=svg-test-32";
import { createHeartItem } from "../collectibles/heart-items.js?v=svg-test-32";

export const CONTACT_DAMAGE = 1;
export const STONE_DAMAGE = 1;

export const damageEnemy = (enemy, amount) => {
  enemy.hp = Math.max(0, (enemy.hp ?? 1) - amount);
  return enemy.hp === 0;
};

export const damageEnemyAt = (state, cell, amount) => {
  const enemy = state.enemies.find((item) => item.x === cell.x && item.y === cell.y);
  if (!enemy) return { hit: false, defeated: false };
  const defeated = damageEnemy(enemy, amount);
  if (defeated) {
    state.enemies = state.enemies.filter((item) => item !== enemy);
    if (enemy.drop) {
      state.powerups.push(createPowerupItem(
        enemy.drop,
        POWERUP_SOURCES.ENEMY_DROP,
        { x: enemy.x, y: enemy.y },
        `drop-${enemy.id}-${state.turn}`
      ));
    }
    if (enemy.heartDrop) {
      state.heartItems.push(createHeartItem(
        POWERUP_SOURCES.ENEMY_DROP,
        { x: enemy.x, y: enemy.y },
        `heart-drop-${enemy.id}-${state.turn}`
      ));
    }
  }
  return { hit: true, defeated, enemy };
};
