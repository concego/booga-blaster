export const HEARTS_PER_LIFE = 3;

const hasEffect = (state, effect) => state.effects?.some((item) => item.effect === effect);

const isElementalDamageBlocked = (state, element) => (
  (element === "fire" && hasEffect(state, "fire-immunity")) ||
  (element === "earth" && hasEffect(state, "earth-immunity"))
);

export const damagePlayer = (state, amount = 1, element = null) => {
  if (state.gameOver || amount <= 0) {
    return { hit: false, lostLife: false, gameOver: state.gameOver, resisted: false };
  }
  if (isElementalDamageBlocked(state, element)) {
    return { hit: false, lostLife: false, gameOver: false, resisted: true };
  }

  state.hearts = Math.max(0, state.hearts - amount);
  if (state.hearts > 0) return { hit: true, lostLife: false, gameOver: false, resisted: false };

  state.lives = Math.max(0, state.lives - 1);
  if (state.lives === 0) {
    state.gameOver = true;
    return { hit: true, lostLife: true, gameOver: true, resisted: false };
  }

  state.hearts = HEARTS_PER_LIFE;
  return { hit: true, lostLife: true, gameOver: false, resisted: false };
};
