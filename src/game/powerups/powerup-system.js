import { getPowerup, POWERUP_TYPES } from "./powerup-catalog.js?v=svg-test-30";
import { openChestContents, revealPowerup } from "./powerup-reveal.js?v=svg-test-30";
import { collectHeartAtCell } from "../collectibles/heart-items.js?v=svg-test-30";

const DEFAULT_DURATION = 8;

const findActiveEffect = (state, effectName) => (
  state.effects.find((effect) => effect.effect === effectName)
);

export const activatePowerup = (state, type, durationTurns = null) => {
  const powerup = getPowerup(type);
  if (!powerup) return { ok: false, message: "Power-up desconhecido." };

  if (type === POWERUP_TYPES.EXTRA_LIFE) {
    state.lives += 1;
    return { ok: true, message: "Vida extra encontrada. +1 vida." };
  }

  const turns = durationTurns || powerup.duration || DEFAULT_DURATION;
  const current = findActiveEffect(state, powerup.effect);
  if (powerup.effect === "bad-news") state.badNewsPhase = 0;
  if (current) current.turns = turns;
  else state.effects.push({ name: powerup.name, effect: powerup.effect, turns });
  state.effectsRevision += 1;
  return { ok: true, message: `${powerup.name} ativada: ${turns} turnos.` };
};

export const collectPowerup = (state, item, durationTurns = DEFAULT_DURATION) => {
  if (!item || item.collected || !item.revealed) {
    return { ok: false, message: "Power-up ainda não pode ser coletado." };
  }
  const result = activatePowerup(state, item.type, durationTurns);
  if (result.ok) item.collected = true;
  return result;
};

export const collectAtCell = (state, cell) => {
  const messages = [];
  const chest = state.chests.find((item) => (
    !item.opened && item.x === cell.x && item.y === cell.y
  ));

  if (chest) {
    chest.opened = true;
    const contents = state.powerups.find((item) => item.id === chest.contents);
    if (contents) openChestContents(contents);
    messages.push("Baú aberto.");
  }

  state.powerups
    .filter((item) => item.x === cell.x && item.y === cell.y && !item.collected)
    .forEach((item) => {
      if (!item.revealed && item.source === "map") revealPowerup(item, item.source);
      const result = collectPowerup(state, item);
      if (result.ok) messages.push(result.message);
    });

  state.heartItems
    .filter((item) => item.x === cell.x && item.y === cell.y && !item.collected)
    .forEach((item) => {
      const message = collectHeartAtCell(state, item);
      if (message && !message.startsWith("Corações já")) messages.push(message);
    });

  return messages;
};
