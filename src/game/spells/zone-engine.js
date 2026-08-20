import { damageEnemyAt } from "../combat/damage.js?v=svg-test-84";
import { damagePlayer } from "../combat/player-damage.js?v=svg-test-84";

export const processFlameZones = (state) => {
  const events = [];
  state.zones
    .filter((zone) => zone.type === "flame")
    .forEach((zone) => {
      zone.cells.forEach((cell) => {
        const result = damageEnemyAt(state, cell, 1, "fire");
        if (!result.hit) return;
        if (result.defeated) events.push("Inimigo derrotado pelas chamas.");
        else if (result.resisted) events.push("O inimigo resistiu às chamas.");
        else events.push("Inimigo atingido pelas chamas.");
      });

      const playerOnFlame = zone.cells.some((cell) => (
        cell.x === state.player.x && cell.y === state.player.y
      ));
      if (!playerOnFlame) return;
      const damage = damagePlayer(state, 1, "fire");
      if (damage.resisted) events.push("Salamandra protegeu Supimpus das chamas.");
      else if (damage.gameOver) events.push("Supimpus foi atingido pelas chamas. Fim de jogo.");
      else if (damage.lostLife) events.push("Supimpus perdeu uma vida nas chamas; corações restaurados.");
      else events.push(`Supimpus foi atingido pelas chamas. Corações: ${state.hearts}/3.`);
    });
  return events;
};
