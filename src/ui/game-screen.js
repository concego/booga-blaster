import { playUiSound, playGameplaySounds } from "../audio/ui-audio.js?v=svg-test-26";
import { createBoogaState } from "../game/booga-state.js?v=svg-test-26";
import { dispatchDirection, prepareLaunch, launchSpell, scanState, selectElement } from "../game/booga-actions.js?v=svg-test-26";
import { addLogMessage } from "../game/demo-state.js?v=svg-test-26";
import { createLogView } from "./log.js?v=svg-test-26";
import { renderArena } from "./arena-svg.js?v=svg-test-26";
import { bindKeyboardControls } from "./keyboard-controls.js?v=svg-test-26";
import { createEffectsStatus } from "./effects-status.js?v=effects-02";

const elementLabels = { fire: "Fogo", water: "Água", earth: "Terra", air: "Ar" };

export const bindGameScreen = () => {
  const state = createBoogaState();
  const logView = createLogView(document.querySelector("#log-list"));
  const actionStatus = document.querySelector("#action-status");
  const effects = document.querySelector("#effects");
  const effectsAnnouncer = document.querySelector("#effects-announcer");
  const effectsStatus = createEffectsStatus(effects, effectsAnnouncer);
  const lives = document.querySelector("#lives");
  const hearts = document.querySelector("#hearts");

  const labelElement = () => elementLabels[state.selectedElement];
  const setStatus = (message) => { actionStatus.textContent = message; };
  const renderLog = () => logView.render(state.log);
  const addLog = (message) => { addLogMessage(state, message); renderLog(); };
  const renderState = () => {
    lives.textContent = String(state.lives);
    hearts.textContent = `${state.hearts}/3`;
    effectsStatus.render(state.effects, state.effectsRevision);
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
    playUiSound(result.ok ? "select" : "error");
    setStatus(result.message);
    if (result.ok) {
      updateElementButtons();
      addLog(result.message);
    }
  };

  const handleDirection = (direction) => {
    const message = dispatchDirection(state, direction);
    playGameplaySounds(message);
    setStatus(message);
    addLog(message);
    renderState();
  };

  const handleLaunch = () => {
    const message = state.launchArmed ? launchSpell(state) : prepareLaunch(state);
    if (state.launchArmed) playGameplaySounds(message);
    else playUiSound("confirm");
    setStatus(message);
    addLog(message);
    renderState();
  };

  const handleScan = () => {
    const result = scanState(state);
    playUiSound("scan");
    addLog(result.intro);
    if (result.findings.length) result.findings.forEach(addLog);
    else addLog(result.announcement);
    setStatus(result.announcement);
  };

  const handleLives = () => {
    const message = `Vidas: ${state.lives}. Corações: ${state.hearts}/3.`;
    setStatus(message);
    addLog(message);
  };

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
