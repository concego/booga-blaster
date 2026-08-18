import { getSpell } from "./spell-catalog.js?v=svg-test-25";
import { blastCells } from "./blast.js?v=svg-test-25";
import { coneCells, upsertZone } from "./area-effects.js?v=svg-test-25";
import { pushEnemies, throwStones } from "./instant-effects.js?v=svg-test-25";
import { revealBlockContents } from "../powerups/powerup-reveal.js?v=svg-test-25";
import { damageEnemyAt, CONTACT_DAMAGE } from "../combat/damage.js?v=svg-test-25";
import { damagePlayer } from "../combat/player-damage.js?v=svg-test-25";

const destroyBlocks = (state, cells) => {
  let destroyed = 0;
  let revealed = 0;
  cells.forEach((cell) => {
    if (state.grid.cells[cell.y][cell.x] !== "#") return;
    state.grid.cells[cell.y][cell.x] = ".";
    destroyed += 1;
    revealed += state.powerups
      .filter((item) => item.x === cell.x && item.y === cell.y && item.source === "block-content")
      .map((item) => revealBlockContents(item))
      .filter(Boolean).length;
  });
  return { destroyed, revealed };
};

const damageEnemies = (state, cells) => {
  const defeated = [];
  const hit = [];
  cells.forEach((cell) => {
    const result = damageEnemyAt(state, cell, CONTACT_DAMAGE);
    if (!result.hit) return;
    if (result.defeated) defeated.push(result.enemy);
    else hit.push(result.enemy);
  });
  return { defeated, hit };
};

const explode = (state, projectile) => {
  const spell = getSpell(projectile.element);
  if (!spell) return "Um projétil sem elemento explodiu sem efeito.";

  const blast = blastCells(state, projectile.cell);
  const cone = projectile.direction ? coneCells(state, projectile.cell, projectile.direction) : [];
  const blocks = destroyBlocks(state, blast);
  const enemies = damageEnemies(state, blast);
  const events = [`${spell.name} explodiu.`];

  if (spell.instantEffect === "push" && projectile.direction) pushEnemies(state, blast, projectile.direction);
  if (spell.instantEffect === "stones") throwStones(state, cone);
  if (spell.zone) upsertZone(state, spell.zone, cone, spell.durationTurns);

  if (blocks.destroyed) events.push(`${blocks.destroyed} bloco${blocks.destroyed > 1 ? "s" : ""} destruído${blocks.destroyed > 1 ? "s" : ""}.`);
  if (blocks.revealed) events.push("Um power-up foi revelado.");
  if (enemies.hit.length) events.push(`${enemies.hit.length} inimigo${enemies.hit.length > 1 ? "s" : ""} atingido${enemies.hit.length > 1 ? "s" : ""}.`);
  if (enemies.defeated.length) events.push(`${enemies.defeated.length} inimigo${enemies.defeated.length > 1 ? "s" : ""} derrotado${enemies.defeated.length > 1 ? "s" : ""}.`);
  if (enemies.defeated.some((enemy) => enemy.drop)) events.push("Um power-up caiu.");

  const playerHit = blast.some((cell) => cell.x === state.player.x && cell.y === state.player.y);
  if (playerHit) {
    const damage = damagePlayer(state, 1);
    if (damage.gameOver) events.push("Supimpus foi atingido. Fim de jogo.");
    else if (damage.lostLife) events.push("Supimpus foi atingido. Uma vida foi perdida; corações restaurados.");
    else events.push(`Supimpus foi atingido. Corações: ${state.hearts}/3.`);
  }

  return events.join(" ");
};

export const resolveProjectiles = (state) => {
  const projectiles = state.projectiles.splice(0);
  return projectiles.map((projectile) => explode(state, projectile));
};
