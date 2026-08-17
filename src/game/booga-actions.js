import { advanceTurn } from "../core/turn-engine.js";
import { getDirection } from "../core/directions.js";
import { scanNearby, tryMovePlayer } from "../core/grid.js";

export const selectElement = (state, element) => {
  if (!state.unlockedElements.includes(element)) {
    return { ok: false, message: `${element} está bloqueado.` };
  }
  state.selectedElement = element;
  state.launchArmed = false;
  return { ok: true, message: `${element} selecionado.` };
};

export const prepareLaunch = (state) => {
  state.launchArmed = true;
  return "Lançar preparado. Escolha uma direção ou pressione Lançar novamente.";
};

export const launchSpell = (state, directionName = null) => {
  const direction = directionName ? getDirection(directionName) : null;
  const x = direction ? state.player.x + direction.dx : state.player.x;
  const y = direction ? state.player.y + direction.dy : state.player.y;

  state.orbs.push({ element: state.selectedElement, x, y, fuse: 2 });
  state.launchArmed = false;
  advanceTurn(state);
  const target = direction ? `para ${direction.label}` : "na própria célula";
  return `${state.selectedElement} lançado ${target}.`;
};

export const dispatchDirection = (state, directionName) => {
  if (state.launchArmed) return launchSpell(state, directionName);
  const result = tryMovePlayer(state, directionName);
  if (result.ok) advanceTurn(state);
  return result.message;
};

export const scanState = (state) => scanNearby(state).join("; ");
