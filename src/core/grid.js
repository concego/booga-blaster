import { getDirection } from "./directions.js?v=svg-test-38";

export const getBlockAt = (state, x, y) => {
  if (!state.grid.blocks) return null;
  return state.grid.blocks.find((block) => (
    block.x === x && block.y === y && state.grid.cells[y][x] === "#"
  )) || null;
};

export const isInsideGrid = (state, x, y) => (
  x >= 0 && x < state.grid.width && y >= 0 && y < state.grid.height
);

export const isBlocked = (state, x, y) => (
  !isInsideGrid(state, x, y) || state.grid.cells[y][x] === "#"
);

export const tryMovePlayer = (state, directionName) => {
  const direction = getDirection(directionName);
  if (!direction) return { ok: false, message: "Direção inválida." };

  const x = state.player.x + direction.dx;
  const y = state.player.y + direction.dy;
  if (isBlocked(state, x, y)) {
    return { ok: false, message: `Bloqueado ao ${direction.label}.` };
  }
  if (state.enemies.some((enemy) => enemy.x === x && enemy.y === y)) {
    return { ok: false, message: `Inimigo bloqueia o caminho ao ${direction.label}.` };
  }

  state.player.x = x;
  state.player.y = y;
  return { ok: true, message: `Supimpus avançou para ${direction.label}.` };
};

export const scanNearby = (state, radius = 5) => {
  const found = [];
  const { x: playerX, y: playerY } = state.player;

  for (let y = 0; y < state.grid.height; y += 1) {
    for (let x = 0; x < state.grid.width; x += 1) {
      const distance = Math.abs(x - playerX) + Math.abs(y - playerY);
      if (distance > radius) continue;
      if (state.grid.cells[y][x] === "#") found.push(`bloco: ${distance} casas`);
    }
  }

  state.enemies.forEach((enemy) => {
    const distance = Math.abs(enemy.x - playerX) + Math.abs(enemy.y - playerY);
    if (distance <= radius) found.push(`${enemy.name}: ${distance} casas`);
  });

  state.orbs.forEach((orb) => {
    const distance = Math.abs(orb.x - playerX) + Math.abs(orb.y - playerY);
    if (distance <= radius) found.push(`${orb.element}: ${distance} casas`);
  });

  return found.length ? found : ["Nada relevante por perto."];
};
