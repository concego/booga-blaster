import { tryMovePlayer } from "../core/grid.js?v=svg-test-48";
import { advanceTurn, getTurnEvents } from "../core/turn-engine.js?v=svg-test-48";
import { scanState, getAdjacentFindings } from "./scan/scan-state.js?v=svg-test-48";
import { castSpell } from "./spells/spell-engine.js?v=svg-test-48";
import { getSpell } from "./spells/spell-catalog.js?v=svg-test-48";
import { collectAtCell } from "./powerups/powerup-system.js?v=svg-test-48";

const appendTurnEvents = (state, message) => {
  const events = getTurnEvents(state);
  if (!message) return events.join(" ");
  return events.length ? `${message} ${events.join(" ")}` : message;
};

export const selectElement = (state, element) => {
  if (state.gameOver) return { ok: false, message: "Fim de jogo." };
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
  if (state.gameOver) return "Fim de jogo.";
  state.launchArmed = true;
  return "Lançar preparado. Escolha uma direção ou pressione Lançar novamente.";
};

export const launchSpell = (state, directionName = null) => {
  const result = castSpell(state, state.selectedElement, directionName);
  if (result.ok) state.launchArmed = false;
  return result.message;
};

export const dispatchDirection = (state, directionName) => {
  if (state.gameOver) return "Fim de jogo.";
  if (state.launchArmed) return launchSpell(state, directionName);
  const result = tryMovePlayer(state, directionName);
  if (!result.ok) return result.message;
  advanceTurn(state);
  const pickupMessages = collectAtCell(state, state.player);
  const pickupText = pickupMessages.join(" ");
  return appendTurnEvents(state, pickupText);
};

export { scanState, getAdjacentFindings };
