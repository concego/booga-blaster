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
| Fogo | 2 | Causa dano a inimigos no contato; cria chamas nas quatro células ortogonais ao redor por 3 turnos. |
| Água | 2 | Causa dano a inimigos no contato e empurra-os 1 célula para trás. |
| Terra | 1 | Causa dano a inimigos no contato; arremessa pedras que também podem causar dano nas quatro células ortogonais ao redor. |
| Ar | 3 | Causa dano a inimigos no contato; cria uma barreira que impede o avanço de inimigos nas quatro células ortogonais ao redor por 2 turnos. |

As quatro células ao redor são inicialmente as direções Norte, Sul, Oeste e Leste. Diagonais podem ser adicionadas por uma melhoria futura.

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
