export const createHeartItem = (source, position, id = `${source}-heart-${position.x}-${position.y}`) => ({
  id,
  source,
  x: position.x,
  y: position.y,
  revealed: source === "map" || source === "enemy-drop",
  collected: false
});

export const collectHeartAtCell = (state, item, maxHearts = 3) => {
  if (!item || item.collected || !item.revealed) return null;
  if (state.hearts >= maxHearts) return "Corações já estão cheios.";
  state.hearts += 1;
  item.collected = true;
  return `Coração encontrado. Corações: ${state.hearts}/${maxHearts}.`;
};
