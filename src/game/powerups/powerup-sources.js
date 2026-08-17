export const POWERUP_SOURCES = Object.freeze({
  MAP: "map",
  ENEMY_DROP: "enemy-drop",
  BLOCK_CONTENT: "block-content",
  CHEST: "chest"
});

export const createPowerupItem = (type, source, position, id = `${source}-${type}-${position.x}-${position.y}`) => ({
  id,
  type,
  source,
  x: position.x,
  y: position.y,
  revealed: source === POWERUP_SOURCES.MAP || source === POWERUP_SOURCES.ENEMY_DROP,
  collected: false
});
