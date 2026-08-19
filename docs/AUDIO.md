# Identidade sonora

O Booga Blaster não reutiliza arquivos do Dino Crawler. As faixas antigas do protótipo foram removidas do diretório `audio/` e não são referenciadas pelo runtime.

## Efeitos integrados

Os primeiros efeitos reais foram escolhidos de dois pacotes externos, separados do Dino Crawler:

- **Kenney — UI Audio**: https://kenney.nl/assets/ui-audio — licença Creative Commons CC0.
  - `ui-select.ogg` — seleção;
  - `ui-confirm.ogg` — confirmação.
- **OpenGameArt — 80 CC0 RPG SFX**: https://opengameart.org/content/80-cc0-rpg-sfx — licença CC0.
  - `spell-fire-launch.ogg` — lançamento de Fogo;
  - `spell-fire-impact.ogg` — impacto/explosão;
  - `enemy-hurt.ogg` — dano;
  - `enemy-defeat.ogg` — derrota;
  - `item-pickup.ogg` — coleta;
  - `block-stone.ogg` — bloqueio/bloco.

O controlador mantém Web Audio como fallback para eventos sem arquivo próprio. Os arquivos reais são curtos e só começam após uma ação do jogador, respeitando a política de autoplay do navegador.

## Efeitos elementais e combate em avaliação

Foram baixados candidatos da Mixkit, sob a Mixkit License, para testar sons próprios de lançamento e combate:

- Água: `spell-water-launch.mp3` — Water Bubble, item 1317;
- Terra: `spell-earth-launch.mp3` — Magical Stone Slide, item 1528;
- Ar: `spell-air-launch.mp3` — Short Wind Swoosh, item 1461;
- explosão: `spell-explosion.mp3` — Explosion Hit, item 1704;
- inimigo atingido: `enemy-impact.mp3` — Impact of a Blow, item 2150.

Fonte: https://mixkit.co/free-sound-effects/

Esses candidatos estão em modo de teste e ficam identificados separadamente dos sons CC0 até a avaliação final de coerência e volume.

## Próximas etapas

- testar esses efeitos no jogo com TalkBack e volume reduzido;
- comparar explosão, atingido e abatido durante uma partida real;
- substituir candidatos que soarem longos, fortes ou inadequados;
- encontrar ou produzir música original para cada variação de bioma e para a Boss Battle;
- manter a fonte e a licença documentadas antes de cada nova integração.
