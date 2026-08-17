# Scan

A função de Scan foi portada do comportamento do Dino Crawler para o núcleo modular de Booga Blaster.

## Regras

- Não consome turno.
- Usa distância Manhattan.
- Considera objetos a menos de 6 casas, ou seja, distância máxima 5.
- Informa a posição relativa usando distância e direção:
  - `N` norte.
  - `S` sul.
  - `O` oeste.
  - `L` leste.
- Quando há deslocamento vertical e horizontal, informa primeiro o vertical.
  - Exemplo: `2S, 1L`.
- Objetos na própria célula são anunciados como `Aqui`.
- O resultado acessível é anunciado como uma mensagem única.
- O log mantém as mensagens individuais, limitado às quatro mais recentes.

## Conteúdo identificado

- Blocos destrutíveis.
- Inimigos e seus nomes.
- Chamas.
- Barreiras de ar.
- Power-ups revelados e ainda não coletados.

A implementação fica em `src/game/scan/scan-state.js` para que a lógica não fique misturada à tela ou ao SVG.
