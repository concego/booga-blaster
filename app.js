(() => {
  "use strict";

  const state = {
    selectedElement: "Fogo",
    launchArmed: false,
    lives: 3,
    log: [
      "Supimpus entrou no Bosque Espinhoso.",
      "Fogo selecionado.",
      "Há caminhos livres ao norte e a leste.",
      "O objetivo é alcançar o Boss da fase."
    ]
  };

  let audioContext = null;

  const getAudioContext = () => {
    if (!audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      audioContext = new AudioContext();
    }
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
  };

  const playUiSound = (kind) => {
    const context = getAudioContext();
    if (!context) return;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const profiles = {
      confirm: { start: 420, end: 680, duration: .13, type: "triangle" },
      back: { start: 520, end: 300, duration: .13, type: "triangle" },
      select: { start: 460, end: 520, duration: .08, type: "sine" },
      move: { start: 180, end: 220, duration: .06, type: "sine" },
      scan: { start: 300, end: 520, duration: .2, type: "sine" },
      pickup: { start: 420, end: 880, duration: .24, type: "triangle" },
      error: { start: 150, end: 110, duration: .16, type: "square" }
    };
    const profile = profiles[kind] || profiles.select;
    oscillator.type = profile.type;
    oscillator.frequency.setValueAtTime(profile.start, now);
    oscillator.frequency.exponentialRampToValueAtTime(profile.end, now + profile.duration);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, now);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.08, now + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, now + profile.duration);
    oscillator.connect(filter).connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + profile.duration + .02);
  };

  const logList = document.querySelector("#log-list");
  const actionStatus = document.querySelector("#action-status");
  const lives = document.querySelector("#lives");
  const effects = document.querySelector("#effects");

  const renderLog = () => {
    logList.replaceChildren();
    state.log.slice(0, 4).forEach((message) => {
      const item = document.createElement("li");
      item.textContent = message;
      logList.append(item);
    });
  };

  const addLog = (message) => {
    state.log.unshift(message);
    state.log = state.log.slice(0, 4);
    renderLog();
  };

  const setStatus = (message) => {
    actionStatus.textContent = message;
  };

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
    playUiSound("confirm");
  };

  const handleDirection = (button) => {
    const direction = button.dataset.direction;
    if (state.launchArmed) {
      fire(direction);
      return;
    }
    addLog(`Supimpus avançou para ${direction}.`);
    setStatus(`Movimento para ${direction}.`);
    playUiSound("move");
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
    playUiSound("scan");
  });

  lives.textContent = String(state.lives);
  effects.innerHTML = '<span class="muted-effect">Nenhum efeito ativo</span>';
  renderLog();
})();
