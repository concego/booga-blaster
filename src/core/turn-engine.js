import { processEnemyTurn } from "../game/combat/enemy-engine.js?v=svg-test-21";
import { resolveProjectiles } from "../game/spells/projectile-engine.js?v=svg-test-21";

export const advanceTurn = (state) => {
  state.turn += 1;

  const activeEffects = state.effects
    .map((effect) => ({ ...effect, turns: effect.turns - 1 }))
    .filter((effect) => effect.turns > 0);
  if (activeEffects.length !== state.effects.length) state.effectsRevision += 1;
  state.effects = activeEffects;

  state.zones = state.zones
    .map((zone) => ({ ...zone, turns: zone.turns - 1 }))
    .filter((zone) => zone.turns > 0);

  state.turnEvents = resolveProjectiles(state);
  state.turnEvents.push(...processEnemyTurn(state));
  return state.turn;
};

export const getTurnEvents = (state) => state.turnEvents || [];
