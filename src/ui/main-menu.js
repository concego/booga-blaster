const TEXT = Object.freeze({
  pt: {
    prompt: "Escolha o idioma",
    subtitle: "Arcade estratégico de elementos",
    newGame: "Novo jogo",
    howTo: "Como jogar",
    credits: "Créditos",
    changeLanguage: "Mudar idioma",
    back: "Voltar",
    howToTitle: "Como jogar",
    howTo: [
      "Escolha um elemento, movimente Supimpus e planeje as explosões.",
      "Cada ação importante consome um turno e permite que os inimigos avancem.",
      "Use Scan para detectar objetos próximos sem consumir turno."
    ],
    creditsTitle: "Créditos"
  },
  en: {
    prompt: "Choose your language",
    subtitle: "Strategic elemental arcade",
    newGame: "New game",
    howTo: "How to play",
    credits: "Credits",
    changeLanguage: "Change language",
    back: "Back",
    howToTitle: "How to play",
    howTo: [
      "Choose an element, move Supimpus and plan your explosions.",
      "Important actions consume a turn and let enemies advance.",
      "Use Scan to detect nearby objects without spending a turn."
    ],
    creditsTitle: "Credits"
  }
});

const setHidden = (element, hidden) => { element.hidden = hidden; };

export const initMainMenu = ({ onStart }) => {
  const menu = document.querySelector("#menu");
  const game = document.querySelector("#game");
  const languageScreen = document.querySelector("#language-screen");
  const mainScreen = document.querySelector("#main-menu-screen");
  const howToScreen = document.querySelector("#how-to-screen");
  const creditsScreen = document.querySelector("#credits-screen");
  const languagePrompt = document.querySelector("#language-prompt");
  const languagePt = document.querySelector("#language-pt");
  const languageEn = document.querySelector("#language-en");
  const currentLanguage = { value: "pt" };

  const show = (screen) => {
    [languageScreen, mainScreen, howToScreen, creditsScreen].forEach((item) => setHidden(item, item !== screen));
    screen.querySelector("button")?.focus();
  };

  const applyLanguage = (language) => {
    currentLanguage.value = language;
    const text = TEXT[language];
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
    languagePrompt.textContent = text.prompt;
    document.querySelector("#menu-subtitle").textContent = text.subtitle;
    document.querySelector("#new-game-button").textContent = text.newGame;
    document.querySelector("#how-to-button").textContent = text.howTo;
    document.querySelector("#credits-button").textContent = text.credits;
    document.querySelector("#change-language-button").textContent = text.changeLanguage;
    document.querySelector("#how-to-title").textContent = text.howToTitle;
    document.querySelector("#how-to-content").innerHTML = text.howTo.map((line) => `<p>${line}</p>`).join("");
    document.querySelector("#how-to-back-button").textContent = text.back;
    document.querySelector("#credits-title").textContent = text.creditsTitle;
    document.querySelector("#credits-back-button").textContent = text.back;
  };

  languagePt.addEventListener("click", () => { applyLanguage("pt"); show(mainScreen); });
  languageEn.addEventListener("click", () => { applyLanguage("en"); show(mainScreen); });
  document.querySelector("#new-game-button").addEventListener("click", () => {
    menu.hidden = true;
    game.hidden = false;
    onStart({ language: currentLanguage.value });
  });
  document.querySelector("#how-to-button").addEventListener("click", () => show(howToScreen));
  document.querySelector("#credits-button").addEventListener("click", () => show(creditsScreen));
  document.querySelector("#change-language-button").addEventListener("click", () => show(languageScreen));
  document.querySelector("#how-to-back-button").addEventListener("click", () => show(mainScreen));
  document.querySelector("#credits-back-button").addEventListener("click", () => show(mainScreen));

  applyLanguage("pt");
  show(languageScreen);
};
