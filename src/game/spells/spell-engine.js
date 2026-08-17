import { advanceTurn } from "../../core/turn-engine.js?v=svg-test-18";
import { getDirection } from "../../core/directions.js?v=svg-test-18";
import { getSpell } from "./spell-catalog.js?v=svg-test-18";
import { coneCells, upsertZone } from "./area-effects.js?v=svg-test-18";
import { destroyContactBlock, findContactCell } from "./contact.js?v=svg-test-18";
import { pushEnemies, throwStones } from "./instant-effects.js?v=svg-test-18";
import { CONTACT_DAMAGE, damageEnemyAt } from "../combat/damage.js?v=svg-test-18";
import { revealBlockContents } from "../powerups/powerup-reveal.js?v=svg-test-18";

const hasEffect = (state, effect) => state.effects.some((item) => item.effect === effect);
const getRange = (state, baseRange) => (hasEffect(state, "throw-range") ? baseRange + 1 : baseRange);

export const castSpell = (state, element, directionName = null) => {
  if (state.gameOver) return { ok: false, message: "Fim de jogo." };
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
  const revealedBlockContents = destroyed
    ? state.powerups.filter((item) => item.x === contact.contact.x && item.y === contact.contact.y && item.source === "block-content")
      .map((item) => revealBlockContents(item))
      .some(Boolean)
    : false;
  const contactHit = damageEnemyAt(state, contact.contact, CONTACT_DAMAGE);
  if (spell.instantEffect === "push" && direction) pushEnemies(state, cone, direction);
  if (spell.instantEffect === "stones") throwStones(state, cone);

  advanceTurn(state);
  if (spell.zone) upsertZone(state, spell.zone, cone, spell.durationTurns);

  const target = direction ? `para ${direction.label}` : "na própria célula";
  const obstacleText = destroyed ? " Obstáculo destruído." : "";
  const revealedText = revealedBlockContents ? " Um power-up foi revelado." : "";
  const hitText = contactHit.defeated
    ? " Inimigo derrotado."
    : contactHit.hit ? " Inimigo atingido." : "";
  const dropText = contactHit.defeated && contactHit.enemy?.drop ? " Um power-up caiu." : "";
  const turnText = state.turnEvents?.length ? ` ${state.turnEvents.join(" ")}` : "";
  return { ok: true, message: `${spell.name} lançado ${target}.${obstacleText}${revealedText}${hitText}${dropText}${turnText}`, contact: contact.contact };
};
