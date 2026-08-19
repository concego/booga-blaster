# Identidade sonora

O jogo usa Web Audio para feedbacks curtos enquanto os arquivos reais próprios de cada bioma e da Boss Battle não são incorporados.

As faixas usadas no Dino Crawler foram removidas do Booga Blaster e não serão reutilizadas. O controlador `src/audio/music-controller.js` permanece preparado para receber uma faixa própria por bioma e uma faixa exclusiva de Boss.

## Próximos arquivos

- música original da Floresta Espinhosa;
- música original para cada novo bioma;
- tema exclusivo da Boss Battle.

A música deverá começar no primeiro comando do jogador, respeitando a política de autoplay do navegador. A troca para Boss Battle já está disponível no controlador por `startBossMusic()`.
