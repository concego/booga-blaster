import { processEnemyTurn } from "../game/combat/enemy-engine.js?v=svg-test-84";
import { resolveProjectiles } from "../game/spells/projectile-engine.js?v=svg-test-84";
import { processFlameZones } from "../game/spells/zone-engine.js?v=svg-test-84";

const hasBadNews = (state) => state.effects.some((effect) => effect.effect === "bad-news");

export const advanceTurn = (state) => {
  state.turn += 1;
  const badNewsActive = hasBadNews(state);
  const enemiesAct = !badNewsActive || state.badNewsPhase === 1;
  if (badNewsActive) state.badNewsPhase = enemiesAct ? 0 : 1;

  const activeEffects = state.effects
    .map((effect) => ({ ...effect, turns: effect.turns - 1 }))
    .filter((effect) => effect.turns > 0);
  if (activeEffects.length !== state.effects.length) state.effectsRevision += 1;
  state.effects = activeEffects;

  state.zones = state.zones
    .map((zone) => ({ ...zone, turns: zone.turns - 1 }))
    .filter((zone) => zone.turns > 0);

  // Zonas antigas causam dano antes da nova explosão; a zona criada agora começa cheia.
  state.turnEvents = processFlameZones(state);
  state.turnEvents.push(...resolveProjectiles(state));
  if (enemiesAct) state.turnEvents.push(...processEnemyTurn(state));
  else state.turnEvents.push("Notícia ruim: Supimpus avançou; os inimigos não agiram.");
  return state.turn;
};

export const getTurnEvents = (state) => state.turnEvents || [];
