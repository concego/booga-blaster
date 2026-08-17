import { scanNearby, tryMovePlayer } from "../core/grid.js";
import { advanceTurn } from "../core/turn-engine.js";
import { castSpell } from "./spells/spell-engine.js";
import { getSpell } from "./spells/spell-catalog.js";

export const selectElement = (state, element) => {
  const spell = getSpell(element);
  const name = spell ? spell.name : element;
  if (!state.unlockedElements.includes(element)) {
    return { ok: false, message: `${name} está bloqueado.` };
  }
  state.selectedElement = element;
  state.launchArmed = false;
  return { ok: true, message: `${name} selecionado.` };
};

export const prepareLaunch = (state) => {
  state.launchArmed = true;
  return "Lançar preparado. Escolha uma direção ou pressione Lançar novamente.";
};

export const launchSpell = (state, directionName = null) => {
  const result = castSpell(state, state.selectedElement, directionName);
  if (result.ok) state.launchArmed = false;
  return result.message;
};

export const dispatchDirection = (state, directionName) => {
  if (state.launchArmed) return launchSpell(state, directionName);
  const result = tryMovePlayer(state, directionName);
  if (result.ok) advanceTurn(state);
  return result.message;
};

export const scanState = (state) => scanNearby(state).join("; ");
