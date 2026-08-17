export const createEffectsStatus = (display, announcer) => {
  let lastRevision = null;

  const render = (effects, revision) => {
    display.innerHTML = effects.length
      ? effects.map((effect) => `<span>${effect.name}: ${effect.turns} turnos</span>`).join("; ")
      : '<span class="muted-effect">Nenhum efeito ativo</span>';

    if (revision === lastRevision) return;
    lastRevision = revision;
    if (revision === 0) return;
    announcer.textContent = effects.length
      ? `Efeitos ativos: ${effects.map((effect) => `${effect.name}, ${effect.turns} turnos`).join("; ")}.`
      : "Nenhum efeito ativo.";
  };

  return { render };
};
