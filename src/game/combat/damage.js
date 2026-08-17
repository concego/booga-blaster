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
  if (defeated) state.enemies = state.enemies.filter((item) => item !== enemy);
  return { hit: true, defeated, enemy };
};
