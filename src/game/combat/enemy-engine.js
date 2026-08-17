import { isBlocked } from "../../core/grid.js?v=svg-test-16";
import { damagePlayer } from "./player-damage.js?v=svg-test-16";

const distanceToPlayer = (state, enemy) => (
  Math.abs(enemy.x - state.player.x) + Math.abs(enemy.y - state.player.y)
);

const enemyAt = (state, x, y, current) => state.enemies.some((enemy) => (
  enemy !== current && enemy.x === x && enemy.y === y
));

const airBlocks = (state, x, y) => state.zones.some((zone) => (
  zone.type === "wind" && zone.cells.some((cell) => cell.x === x && cell.y === y)
));

const canMoveTo = (state, enemy, x, y) => (
  !isBlocked(state, x, y) &&
  !(state.player.x === x && state.player.y === y) &&
  !enemyAt(state, x, y, enemy) &&
  !airBlocks(state, x, y)
);

const moveEnemyTowardsPlayer = (state, enemy) => {
  const dx = state.player.x - enemy.x;
  const dy = state.player.y - enemy.y;
  const candidates = [];

  if (dy !== 0) candidates.push({ x: enemy.x, y: enemy.y + Math.sign(dy) });
  if (dx !== 0) candidates.push({ x: enemy.x + Math.sign(dx), y: enemy.y });
  if (dx !== 0 && dy !== 0) {
    candidates.push({ x: enemy.x, y: enemy.y - Math.sign(dy) });
    candidates.push({ x: enemy.x - Math.sign(dx), y: enemy.y });
  }

  const destination = candidates.find(({ x, y }) => canMoveTo(state, enemy, x, y));
  if (!destination) return false;
  enemy.x = destination.x;
  enemy.y = destination.y;
  return true;
};

const attackPlayer = (state, enemy) => {
  const result = damagePlayer(state, 1);
  if (result.gameOver) return `${enemy.name} atacou Supimpus. Fim de jogo.`;
  if (result.lostLife) return `${enemy.name} atacou Supimpus. Uma vida foi perdida; corações restaurados.`;
  return `${enemy.name} atacou Supimpus. Corações: ${state.hearts}/3.`;
};

export const processEnemyTurn = (state) => {
  if (state.gameOver) return [];
  const events = [];

  for (const enemy of [...state.enemies]) {
    if (state.gameOver) break;
    if (enemy.stunned > 0) {
      enemy.stunned -= 1;
      events.push(`${enemy.name} está atordoado.`);
      continue;
    }

    if (distanceToPlayer(state, enemy) === 1) {
      events.push(attackPlayer(state, enemy));
      continue;
    }

    if (moveEnemyTowardsPlayer(state, enemy)) {
      events.push(`${enemy.name} avançou.`);
    }
  }

  return events;
};
