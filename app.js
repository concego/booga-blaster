try {
  const { initMainMenu } = await import("./src/ui/main-menu.js?v=svg-test-53");
  initMainMenu({
    onStart: async ({ language }) => {
      const { bindGameScreen } = await import(`./src/ui/game-screen.js?v=svg-test-53&lang=${language}`);
      bindGameScreen({ language });
    }
  });
} catch (error) {
  console.error("Falha ao iniciar Booga Blaster", error);
  const status = document.querySelector("#action-status");
  if (status) status.textContent = `Erro ao iniciar: ${error?.message || "módulo indisponível"}`;
}
