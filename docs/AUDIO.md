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

## Próximas etapas

- testar esses efeitos no jogo com TalkBack e volume reduzido;
- avaliar candidatos separados para Água, Terra e Ar;
- encontrar ou produzir música original para cada variação de bioma e para a Boss Battle;
- manter a fonte e a licença documentadas antes de cada nova integração.
