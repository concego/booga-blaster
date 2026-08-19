try {
  const { bindGameScreen } = await import("./src/ui/game-screen.js?v=svg-test-44");
  bindGameScreen();
} catch (error) {
  console.error("Falha ao iniciar Booga Blaster", error);
  const status = document.querySelector("#action-status");
  if (status) status.textContent = `Erro ao iniciar: ${error?.message || "módulo indisponível"}`;
}
