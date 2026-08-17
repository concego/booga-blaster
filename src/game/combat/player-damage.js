export const HEARTS_PER_LIFE = 3;

export const damagePlayer = (state, amount = 1) => {
  if (state.gameOver || amount <= 0) return { hit: false, lostLife: false, gameOver: state.gameOver };

  state.hearts = Math.max(0, state.hearts - amount);
  if (state.hearts > 0) return { hit: true, lostLife: false, gameOver: false };

  state.lives = Math.max(0, state.lives - 1);
  if (state.lives === 0) {
    state.gameOver = true;
    return { hit: true, lostLife: true, gameOver: true };
  }

  state.hearts = HEARTS_PER_LIFE;
  return { hit: true, lostLife: true, gameOver: false };
};
