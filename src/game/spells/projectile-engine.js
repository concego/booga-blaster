import { getSpell } from "./spell-catalog.js?v=svg-test-84";
import { blastCells } from "./blast.js?v=svg-test-84";
import { coneCells, upsertZone } from "./area-effects.js?v=svg-test-84";
import { pushEnemies, throwStones } from "./instant-effects.js?v=svg-test-84";
import { revealBlockContents } from "../powerups/powerup-reveal.js?v=svg-test-84";
import { damageEnemyAt, CONTACT_DAMAGE } from "../combat/damage.js?v=svg-test-84";
import { damagePlayer } from "../combat/player-damage.js?v=svg-test-84";
import { getBlockAt } from "../../core/grid.js?v=svg-test-84";

const destroyBlocks = (state, cells, element) => {
  let destroyed = 0;
  let revealed = 0;
  let resisted = 0;
  cells.forEach((cell) => {
    const block = getBlockAt(state, cell.x, cell.y);
    if (!block) return;
    if (block.immuneTo?.includes(element)) {
      resisted += 1;
      return;
    }
    state.grid.cells[cell.y][cell.x] = ".";
    destroyed += 1;
    revealed += state.powerups
      .filter((item) => item.x === cell.x && item.y === cell.y && item.source === "block-content")
      .map((item) => revealBlockContents(item))
      .filter(Boolean).length;
  });
  return { destroyed, revealed, resisted };
};

const damageEnemies = (state, cells, element) => {
  const defeated = [];
  const hit = [];
  const resisted = [];
  cells.forEach((cell) => {
    const result = damageEnemyAt(state, cell, CONTACT_DAMAGE, element);
    if (!result.hit) return;
    if (result.defeated) defeated.push(result.enemy);
    else if (result.resisted) resisted.push(result.enemy);
    else hit.push(result.enemy);
  });
  return { defeated, hit, resisted };
};

const destroyWebs = (state, cells) => {
  if (!state.webs?.length) return 0;
  const cellKeys = new Set(cells.map((cell) => `${cell.x},${cell.y}`));
  const destroyed = state.webs.filter((web) => cellKeys.has(`${web.x},${web.y}`)).length;
  if (destroyed) state.webs = state.webs.filter((web) => !cellKeys.has(`${web.x},${web.y}`));
  return destroyed;
};

const explode = (state, projectile) => {
  const spell = getSpell(projectile.element);
  if (!spell) return "Um projétil sem elemento explodiu sem efeito.";

  const blast = blastCells(state, projectile.cell);
  const cone = projectile.direction ? coneCells(state, projectile.cell, projectile.direction) : [];
  const blocks = destroyBlocks(state, blast, projectile.element);
  const webs = destroyWebs(state, blast);
  const enemies = damageEnemies(state, blast, projectile.element);
  const events = [`${spell.name} explodiu.`];

  if (webs) events.push(`${webs} teia${webs > 1 ? "s" : ""} destruída${webs > 1 ? "s" : ""}.`);

  const pushed = spell.instantEffect === "push" && projectile.direction
    ? pushEnemies(state, blast, projectile.direction)
    : 0;
  const stones = spell.instantEffect === "stones" ? throwStones(state, cone) : 0;
  const zone = spell.zone ? upsertZone(state, spell.zone, cone, spell.durationTurns) : null;

  if (pushed) events.push(`${pushed} inimigo${pushed > 1 ? "s" : ""} empurrado${pushed > 1 ? "s" : ""}.`);
  if (stones) events.push(`${stones} inimigo${stones > 1 ? "s" : ""} atingido${stones > 1 ? "s" : ""} pelas pedras.`);
  if (zone && spell.zone === "flame") events.push("Chamas criadas no cone.");
  if (zone && spell.zone === "wind") events.push("Barreira de ar criada no cone.");

  if (blocks.destroyed) events.push(`${blocks.destroyed} bloco${blocks.destroyed > 1 ? "s" : ""} destruído${blocks.destroyed > 1 ? "s" : ""}.`);
  if (blocks.resisted) events.push(`${blocks.resisted} bloco${blocks.resisted > 1 ? "s" : ""} ${blocks.resisted > 1 ? "resistiram" : "resistiu"} ao elemento ${spell.name}.`);
  if (blocks.revealed) events.push("Um power-up foi revelado.");
  if (enemies.hit.length) {
    const names = enemies.hit.map((enemy) => enemy.name).join(", ");
    events.push(`${enemies.hit.length} inimigo${enemies.hit.length > 1 ? "s" : ""} atingido${enemies.hit.length > 1 ? "s" : ""}: ${names}.`);
  }
  if (enemies.defeated.length) {
    const names = enemies.defeated.map((enemy) => enemy.name).join(", ");
    events.push(`${enemies.defeated.length} inimigo${enemies.defeated.length > 1 ? "s" : ""} derrotado${enemies.defeated.length > 1 ? "s" : ""}: ${names}.`);
  }
  if (enemies.resisted.length) events.push(`${enemies.resisted.map((enemy) => enemy.name).join(", ")} resistiu ao elemento ${spell.name}.`);
  if (enemies.defeated.some((enemy) => enemy.drop)) events.push("Um power-up caiu.");
  if (enemies.defeated.some((enemy) => enemy.heartDrop)) events.push("Um coração caiu.");
  if (enemies.defeated.some((enemy) => enemy.isSpecial)) events.push("A arena foi vencida.");

  const playerHit = blast.some((cell) => cell.x === state.player.x && cell.y === state.player.y);
  if (playerHit) {
    const damage = damagePlayer(state, 1, projectile.element);
    if (damage.resisted) {
      const protection = projectile.element === "fire" ? "Salamandra" : "Toupeira";
      events.push(`${protection} protegeu Supimpus do elemento ${spell.name}.`);
    }
    else if (damage.gameOver) events.push("Supimpus foi atingido. Fim de jogo.");
    else if (damage.lostLife) events.push("Supimpus foi atingido. Uma vida foi perdida; corações restaurados.");
    else events.push(`Supimpus foi atingido. Corações: ${state.hearts}/3.`);
  }

  return events.join(" ");
};

export const resolveProjectiles = (state) => {
  const projectiles = state.projectiles.splice(0);
  return projectiles.map((projectile) => explode(state, projectile));
};
