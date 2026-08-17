import { playUiSound } from "../audio/ui-audio.js";
import { addLogMessage, createDemoState } from "../game/demo-state.js";
import { createLogView } from "./log.js";

export const bindGameScreen = () => {
  const state = createDemoState();
  const logView = createLogView(document.querySelector("#log-list"));
  const actionStatus = document.querySelector("#action-status");
  const effects = document.querySelector("#effects");

  const setStatus = (message) => { actionStatus.textContent = message; };
  const renderLog = () => logView.render(state.log);
  const addLog = (message) => { addLogMessage(state, message); renderLog(); };

  const setElement = (button) => {
    document.querySelectorAll(".element-button").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    state.selectedElement = button.querySelector("span:nth-child(2)").textContent;
    state.launchArmed = false;
    setStatus(`${state.selectedElement} selecionado.`);
    addLog(`${state.selectedElement} selecionado.`);
  };

  const fire = (direction) => {
    const target = direction ? `para ${direction}` : "na própria célula";
    addLog(`${state.selectedElement} lançado ${target}.`);
    setStatus(`${state.selectedElement} lançado ${target}.`);
    state.launchArmed = false;
  };

  const handleDirection = (button) => {
    const direction = button.dataset.direction;
    if (state.launchArmed) {
      fire(direction);
      return;
    }
    addLog(`Supimpus avançou para ${direction}.`);
    setStatus(`Movimento para ${direction}.`);
  };

  document.querySelectorAll("button[data-sound]").forEach((button) => {
    button.addEventListener("click", () => playUiSound(button.dataset.sound));
  });
  document.querySelectorAll(".element-button:not(:disabled)").forEach((button) => {
    button.addEventListener("click", () => setElement(button));
  });
  document.querySelectorAll(".direction-button").forEach((button) => {
    button.addEventListener("click", () => handleDirection(button));
  });

  document.querySelector("#launch-button").addEventListener("click", () => {
    if (state.launchArmed) {
      fire(null);
      return;
    }
    state.launchArmed = true;
    setStatus("Lançar preparado. Escolha uma direção ou pressione Lançar novamente para atingir sua célula.");
    addLog("Lançar preparado.");
  });

  document.querySelector("#scan-button").addEventListener("click", () => {
    setStatus("Scan concluído.");
    addLog("Ao norte há um caminho livre; ao sul há blocos; a leste há uma esfera de fogo; a oeste há um caminho livre.");
  });

  effects.innerHTML = '<span class="muted-effect">Nenhum efeito ativo</span>';
  renderLog();
};
