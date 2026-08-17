export const advanceTurn = (state) => {
  state.turn += 1;

  state.effects = state.effects
    .map((effect) => ({ ...effect, turns: effect.turns - 1 }))
    .filter((effect) => effect.turns > 0);

  state.orbs = state.orbs
    .map((orb) => ({ ...orb, fuse: orb.fuse - 1 }))
    .filter((orb) => orb.fuse > 0);

  return state.turn;
};
