export const advanceTurn = (state) => {
  state.turn += 1;

  state.effects = state.effects
    .map((effect) => ({ ...effect, turns: effect.turns - 1 }))
    .filter((effect) => effect.turns > 0);

  state.zones = state.zones
    .map((zone) => ({ ...zone, turns: zone.turns - 1 }))
    .filter((zone) => zone.turns > 0);

  return state.turn;
};
