export const POWERUP_SOURCES = Object.freeze({
  MAP: "map",
  ENEMY_DROP: "enemy-drop",
  BLOCK_CONTENT: "block-content",
  CHEST: "chest"
});

export const createPowerupItem = (type, source, position) => ({
  type,
  source,
  x: position.x,
  y: position.y,
  revealed: source === POWERUP_SOURCES.MAP,
  collected: false
});
