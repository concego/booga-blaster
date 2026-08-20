import { POWERUP_SOURCES, createPowerupItem } from "../powerups/powerup-sources.js?v=svg-test-76";
import { createHeartItem } from "../collectibles/heart-items.js?v=svg-test-76";

export const CONTACT_DAMAGE = 1;
export const STONE_DAMAGE = 1;

export const damageEnemy = (enemy, amount, element = null) => {
  if (enemy.onlyElement && enemy.onlyElement !== element) {
    return { defeated: false, resisted: true };
  }
  enemy.hp = Math.max(0, (enemy.hp ?? 1) - amount);
  return { defeated: enemy.hp === 0, resisted: false };
};

export const damageEnemyAt = (state, cell, amount, element = null) => {
  const enemy = state.enemies.find((item) => item.x === cell.x && item.y === cell.y);
  if (!enemy) return { hit: false, defeated: false, resisted: false };
  const result = damageEnemy(enemy, amount, element);
  if (result.defeated) {
    state.enemies = enemy.isSpecial
      ? []
      : state.enemies.filter((item) => item !== enemy);
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
    if (enemy.isSpecial) {
      state.enemies = [];
      state.summonedEnemyIds = [];
      state.specialEnemy = null;
      state.arenaMode = "complete";
      state.phaseComplete = true;
      state.phaseName = "Fase concluída";
    }
  }
  return { hit: true, defeated: result.defeated, resisted: result.resisted, enemy };
};
