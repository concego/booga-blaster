import { tryMovePlayer } from "../core/grid.js?v=svg-test-73";
import { advanceTurn, getTurnEvents } from "../core/turn-engine.js?v=svg-test-73";
import { scanState, getAdjacentFindings } from "./scan/scan-state.js?v=svg-test-73";
import { castSpell } from "./spells/spell-engine.js?v=svg-test-73";
import { getSpell } from "./spells/spell-catalog.js?v=svg-test-73";
import { collectAtCell } from "./powerups/powerup-system.js?v=svg-test-73";
import { enterSpecialArena } from "./special-arena.js?v=svg-test-73";

const appendTurnEvents = (state, message) => {
  const events = getTurnEvents(state);
  if (!message) return events.join(" ");
  return events.length ? `${message} ${events.join(" ")}` : message;
};

export const selectElement = (state, element) => {
  if (state.gameOver) return { ok: false, message: "Fim de jogo." };
  if (state.phaseComplete) return { ok: false, message: "Fase concluída." };
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
  if (state.phaseComplete) return "Fase concluída.";
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
  if (state.phaseComplete) return "Fase concluída.";
  if (state.launchArmed) return launchSpell(state, directionName);
  const result = tryMovePlayer(state, directionName);
  if (!result.ok) return result.message;
  advanceTurn(state);
  const pickupMessages = collectAtCell(state, state.player);
  const pickupText = pickupMessages.join(" ");
  const reachedGoal = state.arenaMode === "normal" && state.goal && (
    state.player.x === state.goal.x && state.player.y === state.goal.y
  );
  const arenaText = reachedGoal ? enterSpecialArena(state) : "";
  return appendTurnEvents(state, [pickupText, arenaText].filter(Boolean).join(" "));
};

export { scanState, getAdjacentFindings };
