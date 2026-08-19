try {
  const { bindGameScreen } = await import("./src/ui/game-screen.js?v=svg-test-48");
  bindGameScreen();
} catch (error) {
  console.error("Falha ao iniciar Booga Blaster", error);
  const status = document.querySelector("#action-status");
  if (status) status.textContent = `Erro ao iniciar: ${error?.message || "módulo indisponível"}`;
}
