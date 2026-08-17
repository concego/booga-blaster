import { advanceTurn } from "../../core/turn-engine.js";
import { getDirection } from "../../core/directions.js";
import { getSpell } from "./spell-catalog.js";
import { adjacentCells, upsertZone } from "./area-effects.js";
import { destroyContactBlock, findContactCell } from "./contact.js";
import { pushEnemies, throwStones } from "./instant-effects.js";
import { CONTACT_DAMAGE, damageEnemyAt } from "../combat/damage.js";

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

  const destroyed = destroyContactBlock(state, contact.contact);
  const contactHit = damageEnemyAt(state, contact.contact, CONTACT_DAMAGE);
  if (spell.instantEffect === "push" && direction) pushEnemies(state, contact.contact, direction);
  if (spell.instantEffect === "stones") throwStones(state, contact.contact);

  advanceTurn(state);
  if (spell.zone) upsertZone(state, spell.zone, adjacentCells(state, contact.contact), spell.durationTurns);

  const target = direction ? `para ${direction.label}` : "na própria célula";
  const obstacleText = destroyed ? " Obstáculo destruído." : "";
  const hitText = contactHit.hit ? " Inimigo atingido." : "";
  return { ok: true, message: `${spell.name} lançado ${target}.${obstacleText}${hitText}`, contact: contact.contact };
};
