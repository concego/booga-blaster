import { playUiSound } from "../audio/ui-audio.js?v=svg-test-03";
import { createBoogaState } from "../game/booga-state.js?v=svg-test-03";
import { dispatchDirection, prepareLaunch, launchSpell, scanState, selectElement } from "../game/booga-actions.js?v=svg-test-03";
import { addLogMessage } from "../game/demo-state.js?v=svg-test-03";
import { createLogView } from "./log.js?v=svg-test-03";
import { renderArena } from "./arena-svg.js?v=svg-test-06";
import { bindKeyboardControls } from "./keyboard-controls.js?v=svg-test-03";

const elementLabels = { fire: "Fogo", water: "Água", earth: "Terra", air: "Ar" };

export const bindGameScreen = () => {
  const state = createBoogaState();
  const logView = createLogView(document.querySelector("#log-list"));
  const actionStatus = document.querySelector("#action-status");
  const effects = document.querySelector("#effects");
  const lives = document.querySelector("#lives");

  const labelElement = () => elementLabels[state.selectedElement];
  const setStatus = (message) => { actionStatus.textContent = message; };
  const renderLog = () => logView.render(state.log);
  const addLog = (message) => { addLogMessage(state, message); renderLog(); };
  const renderState = () => {
    lives.textContent = String(state.lives);
    effects.innerHTML = state.effects.length
      ? state.effects.map((effect) => `<span>${effect.name}: ${effect.turns} turnos</span>`).join("; ")
      : '<span class="muted-effect">Nenhum efeito ativo</span>';
    renderArena(state);
  };

  const updateElementButtons = () => {
    document.querySelectorAll(".element-button").forEach((button) => {
      const selected = button.dataset.element === state.selectedElement;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  };

  const handleElement = (element) => {
    const result = selectElement(state, element);
    setStatus(result.message);
    if (result.ok) {
      updateElementButtons();
      addLog(result.message);
    }
  };

  const handleDirection = (direction) => {
    const message = dispatchDirection(state, direction);
    setStatus(message);
    addLog(message);
    renderState();
  };

  const handleLaunch = () => {
    const message = state.launchArmed ? launchSpell(state) : prepareLaunch(state);
    setStatus(message);
    addLog(message);
    renderState();
  };

  const handleScan = () => {
    const message = `Scan: ${scanState(state)}`;
    setStatus("Scan concluído.");
    addLog(message);
  };

  const handleLives = () => {
    const message = `Vidas: ${state.lives}.`;
    setStatus(message);
    addLog(message);
  };

  document.querySelectorAll("button[data-sound]").forEach((button) => {
    button.addEventListener("click", () => playUiSound(button.dataset.sound));
  });
  document.querySelectorAll(".element-button:not(:disabled)").forEach((button) => {
    button.addEventListener("click", () => handleElement(button.dataset.element));
  });
  document.querySelectorAll(".direction-button").forEach((button) => {
    button.addEventListener("click", () => handleDirection(button.dataset.direction));
  });
  document.querySelector("#launch-button").addEventListener("click", handleLaunch);
  document.querySelector("#scan-button").addEventListener("click", handleScan);
  bindKeyboardControls({
    onDirection: handleDirection,
    onElement: handleElement,
    onLaunch: handleLaunch,
    onScan: handleScan,
    onLives: handleLives
  });

  updateElementButtons();
  renderState();
  renderLog();
  setStatus(`${labelElement()} selecionado.`);
};
