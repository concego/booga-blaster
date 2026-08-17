# Magias elementais

Cada lançamento cria um **projétil** na célula de contato. O projétil permanece visível até o próximo turno; então explode e resolve o efeito da magia.

## Ciclo do lançamento

1. Supimpus escolhe a direção.
2. O projétil percorre a direção até o alcance ou o primeiro obstáculo.
3. A célula de contato é definida.
4. Um bloco na célula de contato é destruído imediatamente.
5. Se houver conteúdo no bloco, o power-up é revelado.
6. O projétil fica parado na célula de contato.
7. No próximo turno, o projétil explode.
8. O dano direto, o efeito instantâneo e o cone secundário são resolvidos na explosão.

O inimigo pode sair da célula antes da explosão. Isso cria uma decisão: esperar a explosão, movimentar-se ou preparar outro lançamento.

## Cone secundário

O efeito secundário usa um cone frontal de três células, orientado pela direção do lançamento. A célula atrás do contato fica fora do cone.

- Células fora do mapa são ignoradas.
- Paredes no cone não são destruídas nem recebem efeito secundário.
- Lançar na própria célula não cria cone.

## Catálogo atual

| Elemento | Alcance | Explosão |
|---|---:|---|
| Fogo | 2 | Dano no contato e chamas no cone por 3 turnos. As chamas causam 1 dano na explosão e a cada turno em que um inimigo permanece na zona. |
| Água | 2 | Dano no contato e empurrão no cone. |
| Terra | 1 | Dano no contato e pedras no cone. |
| Ar | 3 | Dano no contato e barreira no cone por 2 turnos. |

O dano dos inimigos comuns está configurado provisoriamente em 1 HP: uma explosão derrota um inimigo comum. Inimigos especiais poderão usar HP maior.
