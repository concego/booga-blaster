import { playUiSound, playGameplaySounds, playEnvironmentSonar } from "../audio/ui-audio.js?v=svg-test-86";
import { startBiomeMusic } from "../audio/music-controller.js?v=svg-test-84";
import { createBoogaState } from "../game/booga-state.js?v=svg-test-84";
import { advancePhase } from "../game/advance-phase.js?v=svg-test-84";
import { dispatchDirection, prepareLaunch, launchSpell, scanState, getAdjacentFindings, selectElement } from "../game/booga-actions.js?v=svg-test-84";
import { addLogMessage } from "../game/demo-state.js?v=svg-test-84";
import { createLogView } from "./log.js?v=svg-test-84";
import { renderArena } from "./arena-svg.js?v=svg-test-84";
import { bindKeyboardControls } from "./keyboard-controls.js?v=svg-test-84";
import { createEffectsStatus } from "./effects-status.js?v=effects-02";

const elementLabels = { fire: "Fogo", water: "Água", earth: "Terra", air: "Ar" };

export const bindGameScreen = () => {
  const params = new URLSearchParams(window.location.search);
  const testElements = params.get("test") === "elements";
  const testCampaign = params.get("test") === "forest-campaign";
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

  const continueTestCampaign = (message) => {
    if (!testCampaign || !state.phaseComplete || state.currentPhase >= 3) return message;
    const nextMessage = advancePhase(state);
    updateElementButtons();
    return `${message} ${nextMessage}`;
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
    let message = dispatchDirection(state, direction);
    message = continueTestCampaign(message);
    const moved = wasMoving && (
      previousPosition.x !== state.player.x || previousPosition.y !== state.player.y
    );
    let adjacent = [];
    if (moved) {
      try { adjacent = getAdjacentFindings(state); } catch (error) { adjacent = []; }
    }
    const feedback = [
      message,
      adjacent.length ? `Adjacente: ${adjacent.join(", ")}.` : ""
    ].filter(Boolean).join(" ");
    if (feedback) setStatus(feedback);
    if (message) addLog(message);
    if (moved) {
      try { playEnvironmentSonar(state); } catch (error) { /* áudio não pode bloquear o jogo */ }
    }
    try { playGameplaySounds(message, state.selectedElement); } catch (error) { /* feedback visual continua */ }
    renderState();
  };

  const handleLaunch = () => {
    startBiomeMusic(state.biome);
    const wasArmed = state.launchArmed;
    let message = wasArmed ? launchSpell(state) : prepareLaunch(state);
    message = continueTestCampaign(message);
    setStatus(message);
    addLog(message);
    if (wasArmed) {
      try { playGameplaySounds(message, state.selectedElement); } catch (error) { /* feedback visual continua */ }
    } else playUiSound("confirm");
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
