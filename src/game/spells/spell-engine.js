import { advanceTurn } from "../../core/turn-engine.js?v=svg-test-22";
import { getDirection } from "../../core/directions.js?v=svg-test-22";
import { getSpell } from "./spell-catalog.js?v=svg-test-22";
import { destroyContactBlock, findContactCell } from "./contact.js?v=svg-test-22";
import { revealBlockContents } from "../powerups/powerup-reveal.js?v=svg-test-22";

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

  const destroyed = destroyContactBlock(state, contact.contact);
  const revealedBlockContents = destroyed
    ? state.powerups
      .filter((item) => item.x === contact.contact.x && item.y === contact.contact.y && item.source === "block-content")
      .map((item) => revealBlockContents(item))
      .some(Boolean)
    : false;

  // O impacto chega à célula agora, mas a explosão só é resolvida no próximo turno.
  advanceTurn(state);
  state.projectiles.push({
    element,
    cell: contact.contact,
    direction: direction || null,
    turnsUntilExplosion: 1
  });

  const target = direction ? `para ${direction.label}` : "na própria célula";
  const obstacleText = destroyed ? " Obstáculo destruído." : "";
  const revealedText = revealedBlockContents ? " Um power-up foi revelado." : "";
  const turnText = state.turnEvents?.length ? ` ${state.turnEvents.join(" ")}` : "";
  return {
    ok: true,
    message: `${spell.name} lançado ${target}. Projétil preparado para explodir no próximo turno.${obstacleText}${revealedText}${turnText}`,
    contact: contact.contact
  };
};
