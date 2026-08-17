import { getSpell } from "./spell-catalog.js?v=svg-test-21";
import { coneCells, upsertZone } from "./area-effects.js?v=svg-test-21";
import { pushEnemies, throwStones } from "./instant-effects.js?v=svg-test-21";
import { damageEnemyAt, CONTACT_DAMAGE } from "../combat/damage.js?v=svg-test-21";

const explode = (state, projectile) => {
  const spell = getSpell(projectile.element);
  if (!spell) return "Um projétil sem elemento explodiu sem efeito.";

  const cone = projectile.direction ? coneCells(state, projectile.cell, projectile.direction) : [];
  const contactHit = damageEnemyAt(state, projectile.cell, CONTACT_DAMAGE);
  if (spell.instantEffect === "push" && projectile.direction) pushEnemies(state, cone, projectile.direction);
  if (spell.instantEffect === "stones") throwStones(state, cone);
  if (spell.zone) upsertZone(state, spell.zone, cone, spell.durationTurns);

  const hitText = contactHit.defeated
    ? " Inimigo derrotado."
    : contactHit.hit ? " Inimigo atingido." : "";
  const dropText = contactHit.defeated && contactHit.enemy?.drop ? " Um power-up caiu." : "";
  return `${spell.name} explodiu.${hitText}${dropText}`;
};

export const resolveProjectiles = (state) => {
  const projectiles = state.projectiles.splice(0);
  return projectiles.map((projectile) => explode(state, projectile));
};
