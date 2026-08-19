# Identidade sonora

O jogo usa arquivos reais de áudio para a camada musical e mantém Web Audio como fallback para feedbacks curtos.

## Música

- `audio/jungle-music.ogg`: música da Floresta Espinhosa.
- `audio/forest-ambience.mp3`: ambiente natural reservado para variações de floresta.
- `audio/rex-tension.ogg`: faixa de Boss Battle.

A música de bioma começa no primeiro comando do jogador, respeitando a política de autoplay do navegador. A troca para Boss Battle já está disponível no controlador por `startBossMusic()`; será ligada ao estado real do Boss quando o combate for implementado.

Cada novo bioma deve receber sua própria faixa no catálogo `src/audio/music-controller.js`. Os efeitos curtos continuam podendo usar arquivos reais, com Web Audio como fallback quando o arquivo não estiver disponível.
