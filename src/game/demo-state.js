export const createDemoState = () => ({
  selectedElement: "Fogo",
  launchArmed: false,
  lives: 3,
  log: [
    "Supimpus entrou no Bosque Espinhoso.",
    "Fogo selecionado.",
    "Há caminhos livres ao norte e a leste.",
    "O objetivo é alcançar o Boss da fase."
  ]
});

export const addLogMessage = (state, message) => {
  state.log.unshift(message);
  state.log = state.log.slice(0, 4);
};
