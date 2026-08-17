# Magias elementais

## Alcance e contato

Cada lançamento percorre a direção escolhida até o alcance do elemento.

- Se encontra uma parede/bloco destrutível, essa é a célula de contato.
- O bloco é destruído.
- A explosão resolve na célula de contato.
- O lançamento não atravessa o obstáculo.
- Se não encontra obstáculo dentro do alcance, a explosão resolve na última célula alcançada.

O ponto de contato pode ser a célula do próprio jogador quando Lançar é acionado duas vezes.

## Efeitos

| Elemento | Alcance | Efeito |
|---|---:|---|
| Fogo | 2 | Causa dano a inimigos no contato; cria chamas no cone frontal por 3 turnos. |
| Água | 2 | Causa dano a inimigos no contato; empurra inimigos no cone 1 célula para trás. |
| Terra | 1 | Causa dano a inimigos no contato; arremessa pedras que podem causar dano no cone frontal. |
| Ar | 3 | Causa dano a inimigos no contato; cria uma barreira no cone que impede o avanço por 2 turnos. |

O efeito secundário usa um cone frontal de três células, orientado pela direção do lançamento. Para um disparo para leste, são afetadas as células acima, à frente e abaixo do contato. A célula atrás do contato, onde normalmente está o jogador, fica fora do cone.

- Células fora do mapa são ignoradas.
- Paredes no cone não são destruídas nem recebem efeito secundário.
- Lançar na própria célula não cria cone; apenas resolve o efeito direto no contato.

O protótipo usa 1 ponto de dano no contato e 1 ponto de dano por pedra. Os valores são de balanceamento inicial.

## Turnos persistentes

- Uma zona persistente recebe sua duração completa depois que o lançamento é processado.
- A cada turno seguinte, a duração diminui em 1.
- Ao chegar a zero, a zona é removida.
- Um novo efeito do mesmo tipo em área sobreposta recarrega a duração para o valor-base.
- Efeitos diferentes podem coexistir em áreas sobrepostas.

Água e Terra têm efeitos instantâneos no modelo inicial. Fogo e Ar criam zonas persistentes.

## Implementação

- `spell-catalog.js`: alcance e efeito-base de cada elemento.
- `contact.js`: célula de contato e destruição de blocos.
- `area-effects.js`: células adjacentes e zonas persistentes.
- `instant-effects.js`: empurrão e pedras.
- `spell-engine.js`: coordenação do lançamento.
