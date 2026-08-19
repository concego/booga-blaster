import { bindGameScreen } from "./src/ui/game-screen.js?v=svg-test-40";

try {
  bindGameScreen();
} catch (error) {
  console.error("Falha ao iniciar Booga Blaster", error);
  const status = document.querySelector("#action-status");
  if (status) status.textContent = "Não foi possível iniciar a fase. Recarregue a página.";
}
