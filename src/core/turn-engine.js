import { processEnemyTurn } from "../game/combat/enemy-engine.js?v=svg-test-16";

export const advanceTurn = (state) => {
  state.turn += 1;

  // Inimigos agem enquanto as zonas ainda estão ativas neste turno.
  state.turnEvents = processEnemyTurn(state);

  const activeEffects = state.effects
    .map((effect) => ({ ...effect, turns: effect.turns - 1 }))
    .filter((effect) => effect.turns > 0);
  if (activeEffects.length !== state.effects.length) state.effectsRevision += 1;
  state.effects = activeEffects;

  state.zones = state.zones
    .map((zone) => ({ ...zone, turns: zone.turns - 1 }))
    .filter((zone) => zone.turns > 0);

  return state.turn;
};

export const getTurnEvents = (state) => state.turnEvents || [];
