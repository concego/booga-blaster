import { playUiSound, playGameplaySounds, playEnvironmentSonar } from "../audio/ui-audio.js?v=svg-test-54";
import { startBiomeMusic } from "../audio/music-controller.js?v=svg-test-54";
import { createBoogaState } from "../game/booga-state.js?v=svg-test-54";
import { dispatchDirection, prepareLaunch, launchSpell, scanState, getAdjacentFindings, selectElement } from "../game/booga-actions.js?v=svg-test-54";
import { addLogMessage } from "../game/demo-state.js?v=svg-test-54";
import { createLogView } from "./log.js?v=svg-test-54";
import { renderArena } from "./arena-svg.js?v=svg-test-54";
import { bindKeyboardControls } from "./keyboard-controls.js?v=svg-test-54";
import { createEffectsStatus } from "./effects-status.js?v=effects-02";

const elementLabels = { fire: "Fogo", water: "Água", earth: "Terra", air: "Ar" };

export const bindGameScreen = () => {
  const params = new URLSearchParams(window.location.search);
  const testElements = params.get("test") === "elements";
  const seed = params.get("seed") || Date.now();
  const difficulty = Math.max(1, Number(params.get("level") || 1) || 1);
  const biome = params.get("biome") || "bosque";
  const state = createBoogaState({ testElements, seed, difficulty, biome });
  const logView = createLogView(document.querySelector("#log-list"));
  const actionStatus = document.querySelector("#action-status");
  const actionAnnouncers = [
    document.querySelector("#action-announcer-a"),
    document.querySelector("#action-announcer-b")
  ];
  let announcerIndex = 0;
  const effects = document.querySelector("#effects");
  const effectsAnnouncer = document.querySelector("#effects-announcer");
  const effectsStatus = createEffectsStatus(effects, effectsAnnouncer);
  const lives = document.querySelector("#lives");
  const hearts = document.querySelector("#hearts");

  const labelElement = () => elementLabels[state.selectedElement];
  const setStatus = (message) => {
    actionStatus.textContent = message;
    if (!message) return;
    const current = actionAnnouncers[announcerIndex];
    const other = actionAnnouncers[1 - announcerIndex];
    if (!current || !other) return;
    other.textContent = "";
    current.textContent = message;
    announcerIndex = 1 - announcerIndex;
  };
  const renderLog = () => logView.render(state.log);
  const addLog = (message) => { addLogMessage(state, message); renderLog(); };
  const renderState = () => {
    document.querySelector("#phase-name").textContent = state.phaseName;
    lives.textContent = String(state.lives);
    hearts.textContent = `${state.hearts}/3`;
    effectsStatus.render(state.effects, state.effectsRevision);
    renderArena(state);
  };

  const updateElementButtons = () => {
    document.querySelectorAll(".element-button").forEach((button) => {
      const selected = button.dataset.element === state.selectedElement;
      button.classList.toggle("is-selected", selected);
      const unlocked = state.unlockedElements.includes(button.dataset.element);
      button.disabled = !unlocked;
      button.classList.toggle("is-test-unlocked", testElements && unlocked);
      const lockedLabel = button.querySelector(".locked-label");
      if (lockedLabel) lockedLabel.hidden = unlocked;
      button.setAttribute("aria-pressed", String(selected));
    });
  };

  const handleElement = (element) => {
    startBiomeMusic(state.biome);
    const result = selectElement(state, element);
    playUiSound(result.ok ? "select" : "error");
    setStatus(result.message);
    if (result.ok) {
      updateElementButtons();
      addLog(result.message);
    }
  };

  const handleDirection = (direction) => {
    startBiomeMusic(state.biome);
    const wasMoving = !state.launchArmed;
    const previousPosition = { ...state.player };
    const message = dispatchDirection(state, direction);
    const moved = wasMoving && (
      previousPosition.x !== state.player.x || previousPosition.y !== state.player.y
    );
    playGameplaySounds(message);
    if (moved) {
      playEnvironmentSonar(state);
      const adjacent = getAdjacentFindings(state);
      if (adjacent.length) setStatus(`${message ? `${message} ` : ""}Adjacente: ${adjacent.join(", ")}.`);
      else if (message) setStatus(message);
    } else if (message) {
      setStatus(message);
    }
    if (message) addLog(message);
    renderState();
  };

  const handleLaunch = () => {
    startBiomeMusic(state.biome);
    const message = state.launchArmed ? launchSpell(state) : prepareLaunch(state);
    if (state.launchArmed) playGameplaySounds(message);
    else playUiSound("confirm");
    setStatus(message);
    addLog(message);
    renderState();
  };

  const handleScan = () => {
    startBiomeMusic(state.biome);
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

  document.querySelectorAll(".element-button").forEach((button) => {
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
