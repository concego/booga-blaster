# Identidade sonora

O Booga Blaster não reutiliza arquivos do Dino Crawler. As faixas antigas do protótipo foram removidas do diretório `audio/` e não são referenciadas pelo runtime.

## Efeitos aprovados e integrados

Os arquivos aprovados foram selecionados no repositório [sound-testing](https://github.com/concego/sound-testing):

- `ui-select.ogg` — seleção — candidato 3.1;
- `ui-confirm.ogg` — confirmação — candidato 3.2;
- `spell-fire-launch.ogg` — lançamento de Fogo — candidato 1.1;
- `spell-earth-launch.mp3` — lançamento de Terra — candidato 1.3.

Fontes dos arquivos aprovados:

- Kenney — UI Audio: https://kenney.nl/assets/ui-audio — Creative Commons CC0;
- OpenGameArt — 80 CC0 RPG SFX: https://opengameart.org/content/80-cc0-rpg-sfx — CC0;
- Mixkit — Magical Stone Slide, item 1528: https://mixkit.co/free-sound-effects/ — Mixkit License.

## Efeitos ainda sem arquivo aprovado

Água, Ar, explosão, inimigo atingido, inimigo abatido, coleta, bloqueio e dano continuam usando o fallback Web Audio enquanto não houver aprovação específica.

O controlador mantém esse fallback para evitar que sons não aprovados sejam integrados por engano. A música do Bosque e a música de Boss continuam pendentes.
