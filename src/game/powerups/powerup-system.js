import { getPowerup, POWERUP_TYPES } from "./powerup-catalog.js?v=svg-test-18";
import { openChestContents, revealPowerup } from "./powerup-reveal.js?v=svg-test-18";

const DEFAULT_DURATION = 8;

const findActiveEffect = (state, effectName) => (
  state.effects.find((effect) => effect.effect === effectName)
);

export const activatePowerup = (state, type, durationTurns = DEFAULT_DURATION) => {
  const powerup = getPowerup(type);
  if (!powerup) return { ok: false, message: "Power-up desconhecido." };

  if (type === POWERUP_TYPES.EXTRA_LIFE) {
    state.lives += 1;
    return { ok: true, message: "Vida extra encontrada. +1 vida." };
  }

  const current = findActiveEffect(state, powerup.effect);
  if (current) current.turns = durationTurns;
  else state.effects.push({ name: powerup.name, effect: powerup.effect, turns: durationTurns });
  state.effectsRevision += 1;
  return { ok: true, message: `${powerup.name} ativada: ${durationTurns} turnos.` };
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

  return messages;
};
