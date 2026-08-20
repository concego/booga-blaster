import { isBlocked } from "../../core/grid.js?v=svg-test-82";
import { damagePlayer } from "./player-damage.js?v=svg-test-82";

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

const movementCandidates = (state, enemy) => {
  const dx = state.player.x - enemy.x;
  const dy = state.player.y - enemy.y;
  const candidates = [];

  if (dy !== 0) candidates.push({ x: enemy.x, y: enemy.y + Math.sign(dy) });
  if (dx !== 0) candidates.push({ x: enemy.x + Math.sign(dx), y: enemy.y });
  if (dx !== 0 && dy !== 0) {
    candidates.push({ x: enemy.x, y: enemy.y - Math.sign(dy) });
    candidates.push({ x: enemy.x - Math.sign(dx), y: enemy.y });
  }
  return candidates;
};

const moveEnemyTowardsPlayer = (state, enemy) => {
  const destination = movementCandidates(state, enemy)
    .find(({ x, y }) => canMoveTo(state, enemy, x, y));
  if (!destination) return false;
  enemy.x = destination.x;
  enemy.y = destination.y;
  return true;
};

const breakBlockInPath = (state, enemy) => {
  if (enemy.behavior !== "break-blocks") return false;
  const block = movementCandidates(state, enemy)
    .map(({ x, y }) => state.grid.blocks?.find((item) => item.x === x && item.y === y))
    .find((item) => item && state.grid.cells[item.y]?.[item.x] === "#");
  if (!block) return false;
  state.grid.cells[block.y][block.x] = ".";
  return true;
};

const attackPlayer = (state, enemy) => {
  const result = damagePlayer(state, 1);
  if (result.gameOver) return `${enemy.name} atacou Supimpus. Fim de jogo.`;
  if (result.lostLife) return `${enemy.name} atacou Supimpus. Uma vida foi perdida; corações restaurados.`;
  return `${enemy.name} atacou Supimpus. Corações: ${state.hearts}/3.`;
};

const rangedAttack = (state, enemy) => {
  const result = damagePlayer(state, 1);
  enemy.reloadTurns = 1;
  if (result.gameOver) return `${enemy.name} atirou em Supimpus com o estilingue. Fim de jogo.`;
  if (result.lostLife) return `${enemy.name} atirou em Supimpus com o estilingue. Uma vida foi perdida; corações restaurados.`;
  return `${enemy.name} atirou em Supimpus com o estilingue. Corações: ${state.hearts}/3.`;
};

const placeWeb = (state, enemy) => {
  if (!state.webs) state.webs = [];
  const target = movementCandidates(state, enemy)
    .find(({ x, y }) => (
      !isBlocked(state, x, y) &&
      !(state.player.x === x && state.player.y === y) &&
      !enemyAt(state, x, y, enemy) &&
      !state.webs.some((web) => web.x === x && web.y === y)
    ));
  if (!target) return false;
  state.webs.push({ x: target.x, y: target.y, source: enemy.id });
  return true;
};

const summonWolf = (state, enemy) => {
  const directions = [
    { x: enemy.x, y: enemy.y - 1 },
    { x: enemy.x, y: enemy.y + 1 },
    { x: enemy.x - 1, y: enemy.y },
    { x: enemy.x + 1, y: enemy.y }
  ];
  const cell = directions.find(({ x, y }) => canMoveTo(state, enemy, x, y));
  if (!cell) return false;
  const index = state.enemies.filter((item) => item.summonedBy === enemy.id).length + 1;
  const wolf = {
    id: `${enemy.id}-wolf-${index}`,
    name: "Lobo",
    role: "common",
    hp: 1,
    maxHp: 1,
    stunned: 0,
    summonedBy: enemy.id,
    ...cell
  };
  state.enemies.push(wolf);
  state.summonedEnemyIds.push(wolf.id);
  return true;
};

const handleSpecialAction = (state, enemy) => {
  if (enemy.behavior === "webs") {
    return placeWeb(state, enemy) ? `${enemy.name} lançou uma teia a um quadrado de distância.` : null;
  }

  if (enemy.behavior === "summon-wolves") {
    if (enemy.summonCooldown > 0) {
      enemy.summonCooldown -= 1;
      return null;
    }
    const summoned = summonWolf(state, enemy);
    if (summoned) enemy.summonCooldown = 2;
    return summoned ? `${enemy.name} uivou e invocou um lobo.` : null;
  }

  if (enemy.behavior === "slingshot-potion") {
    if (enemy.potionTurns > 0) {
      enemy.potionTurns -= 1;
      if (enemy.potionTurns === 0) {
        state.hearts = Math.min(3, state.hearts + 1);
        enemy.potionUsed = true;
        return `${enemy.name} tomou a poção e recuperou um coração.`;
      }
      return `${enemy.name} está pegando a poção na bolsa.`;
    }
    if (enemy.potionAvailable && !enemy.potionUsed && state.hearts < 3) {
      enemy.potionTurns = 1;
      return `${enemy.name} começou a pegar a poção da bolsa.`;
    }
    if (enemy.reloadTurns > 0) {
      enemy.reloadTurns -= 1;
      return enemy.reloadTurns === 0
        ? `${enemy.name} carregou o estilingue.`
        : `${enemy.name} está recarregando o estilingue.`;
    }
    if (distanceToPlayer(state, enemy) <= enemy.ranged) return rangedAttack(state, enemy);
  }

  return null;
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

    if (enemy.behavior === "slingshot-potion" || enemy.behavior === "summon-wolves") {
      const specialEvent = handleSpecialAction(state, enemy);
      if (specialEvent) {
        events.push(specialEvent);
        continue;
      }
    }

    if (distanceToPlayer(state, enemy) === 1) {
      events.push(attackPlayer(state, enemy));
      continue;
    }

    if (moveEnemyTowardsPlayer(state, enemy)) {
      events.push(`${enemy.name} se moveu.`);
      continue;
    }

    const specialEvent = enemy.behavior === "webs" ? handleSpecialAction(state, enemy) : null;
    if (specialEvent) {
      events.push(specialEvent);
      continue;
    }

    if (breakBlockInPath(state, enemy)) {
      events.push(`${enemy.name} quebrou um bloco no caminho.`);
    }
  }

  return events;
};
