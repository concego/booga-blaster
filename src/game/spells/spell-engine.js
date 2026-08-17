import { advanceTurn } from "../../core/turn-engine.js?v=svg-test-13";
import { getDirection } from "../../core/directions.js?v=svg-test-13";
import { getSpell } from "./spell-catalog.js?v=svg-test-13";
import { coneCells, upsertZone } from "./area-effects.js?v=svg-test-13";
import { destroyContactBlock, findContactCell } from "./contact.js?v=svg-test-13";
import { pushEnemies, throwStones } from "./instant-effects.js?v=svg-test-13";
import { CONTACT_DAMAGE, damageEnemyAt } from "../combat/damage.js?v=svg-test-13";

const hasEffect = (state, effect) => state.effects.some((item) => item.effect === effect);
const getRange = (state, baseRange) => (hasEffect(state, "throw-range") ? baseRange + 1 : baseRange);

export const castSpell = (state, element, directionName = null) => {
  const spell = getSpell(element);
  const direction = directionName ? getDirection(directionName) : null;
  if (!spell) return { ok: false, message: "Elemento sem magia configurada." };
  if (directionName && !direction) return { ok: false, message: "Direção inválida." };

  const contact = direction
    ? findContactCell(state, directionName, getRange(state, spell.range))
    : { ok: true, contact: { x: state.player.x, y: state.player.y }, blocked: false };
  if (!contact.ok) return contact;

  const cone = direction ? coneCells(state, contact.contact, direction) : [];
  const destroyed = destroyContactBlock(state, contact.contact);
  const contactHit = damageEnemyAt(state, contact.contact, CONTACT_DAMAGE);
  if (spell.instantEffect === "push" && direction) pushEnemies(state, cone, direction);
  if (spell.instantEffect === "stones") throwStones(state, cone);

  advanceTurn(state);
  if (spell.zone) upsertZone(state, spell.zone, cone, spell.durationTurns);

  const target = direction ? `para ${direction.label}` : "na própria célula";
  const obstacleText = destroyed ? " Obstáculo destruído." : "";
  const hitText = contactHit.hit ? " Inimigo atingido." : "";
  return { ok: true, message: `${spell.name} lançado ${target}.${obstacleText}${hitText}`, contact: contact.contact };
};
