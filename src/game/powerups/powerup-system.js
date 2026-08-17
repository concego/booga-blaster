import { getPowerup, POWERUP_TYPES } from "./powerup-catalog.js?v=svg-test-03";

const findActiveEffect = (state, effectName) => (
  state.effects.find((effect) => effect.effect === effectName)
);

export const activatePowerup = (state, type, durationTurns) => {
  const powerup = getPowerup(type);
  if (!powerup) return { ok: false, message: "Power-up desconhecido." };

  if (type === POWERUP_TYPES.EXTRA_LIFE) {
    state.lives += 1;
    return { ok: true, message: "Vida extra encontrada. +1 vida." };
  }

  if (!Number.isInteger(durationTurns) || durationTurns <= 0) {
    return { ok: false, message: `${powerup.name} aguarda duração definida.` };
  }

  const current = findActiveEffect(state, powerup.effect);
  if (current) {
    current.turns = durationTurns;
  } else {
    state.effects.push({ name: powerup.name, effect: powerup.effect, turns: durationTurns });
  }

  return { ok: true, message: `${powerup.name} ativada: ${durationTurns} turnos.` };
};

export const collectPowerup = (state, item, durationTurns) => {
  if (!item || item.collected || !item.revealed) {
    return { ok: false, message: "Power-up ainda não pode ser coletado." };
  }

  const result = activatePowerup(state, item.type, durationTurns);
  if (result.ok) item.collected = true;
  return result;
};
