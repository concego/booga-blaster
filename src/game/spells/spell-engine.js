import { advanceTurn } from "../../core/turn-engine.js?v=svg-test-81";
import { getDirection } from "../../core/directions.js?v=svg-test-81";
import { getSpell } from "./spell-catalog.js?v=svg-test-81";
import { findContactCell } from "./contact.js?v=svg-test-81";

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
    : { ok: true, contact: { x: state.player.x, y: state.player.y }, projectile: { x: state.player.x, y: state.player.y }, blocked: false };
  if (!contact.ok) return contact;

  // O lançamento cria o item. O próximo turno resolve toda a explosão.
  advanceTurn(state);
  state.projectiles.push({
    element,
    cell: contact.projectile || contact.contact,
    obstacle: contact.blocked ? contact.contact : null,
    direction: direction || null,
    turnsUntilExplosion: 1
  });

  const target = direction ? `para ${direction.label}` : "na própria célula";
  const landingText = contact.blocked
    ? " O projétil caiu antes do bloco e explodirá sobre ele no próximo turno."
    : " O projétil ficou no chão e explodirá no próximo turno.";
  const turnText = state.turnEvents?.length ? ` ${state.turnEvents.join(" ")}` : "";
  return {
    ok: true,
    message: `${spell.name} lançado ${target}.${landingText}${turnText}`,
    contact: contact.projectile || contact.contact
  };
};
