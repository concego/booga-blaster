try {
  const { initMainMenu } = await import("./src/ui/main-menu.js?v=svg-test-69");
  initMainMenu({
    onStart: async ({ language }) => {
      try {
        const { bindGameScreen } = await import(`./src/ui/game-screen.js?v=svg-test-69&lang=${language}`);
        bindGameScreen({ language });
      } catch (error) {
        console.error("Falha ao iniciar a partida", error);
        const status = document.querySelector("#action-status");
        if (status) status.textContent = "Não foi possível iniciar a partida. Recarregue e tente novamente.";
      }
    }
  });
} catch (error) {
  console.error("Falha ao iniciar Booga Blaster", error);
  const status = document.querySelector("#action-status");
  if (status) status.textContent = `Erro ao iniciar: ${error?.message || "módulo indisponível"}`;
}
