import { damageEnemyAt } from "../combat/damage.js?v=svg-test-22";

export const processFlameZones = (state) => {
  const events = [];
  state.zones
    .filter((zone) => zone.type === "flame")
    .forEach((zone) => zone.cells.forEach((cell) => {
      const result = damageEnemyAt(state, cell, 1);
      if (!result.hit) return;
      if (result.defeated) events.push("Inimigo derrotado pelas chamas.");
      else events.push("Inimigo atingido pelas chamas.");
    }));
  return events;
};
