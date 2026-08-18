# Magias elementais

Cada lançamento cria um **projétil** que fica no chão até o próximo turno. A explosão acontece no centro onde o projétil caiu.

## Contato com bloco

Quando o projétil encontra um bloco, ele não ocupa a célula do bloco: cai na célula imediatamente anterior. No próximo turno, a explosão atinge o bloco a partir dessa posição.

A explosão usa raio de 1 célula em **cruz**, ocupando até cinco células: centro, Norte, Sul, Oeste e Leste. Ela pode atingir Supimpus, inimigos e blocos alinhados diretamente com o projétil, mas não atinge diagonais. Isso reduz a força da explosão circular e deixa a área de risco mais legível.

O personagem tem um turno para sair da área. Se continuar dentro da explosão, recebe dano.

## Ciclo do lançamento

1. Supimpus escolhe a direção.
2. O projétil percorre a direção até o alcance ou o primeiro obstáculo.
3. Se encontrar um bloco, cai na célula anterior ao bloco.
4. O projétil permanece visível no chão.
5. No próximo turno, a área de raio 1 em cruz explode.
6. A explosão destrói os blocos da cruz e revela conteúdos escondidos.
7. Inimigos dentro da cruz recebem dano.
8. O efeito elemental secundário é aplicado no cone frontal.

Se não houver obstáculo, o projétil cai na última célula dentro do alcance.

## Cone secundário

O efeito secundário usa um cone frontal de três células, orientado pela direção do lançamento. A célula atrás do projétil fica fora do cone.

- Células fora do mapa são ignoradas.
- Paredes no cone são destruídas apenas se estiverem dentro da área de explosão.
- Lançar na própria célula cria uma explosão centrada no jogador no próximo turno.

## Catálogo atual

| Elemento | Alcance | Explosão |
|---|---:|---|
| Fogo | 2 | Dano na área de raio 1 e chamas no cone por 3 turnos. As chamas causam 1 dano nos turnos em que um inimigo permanece na zona. |
| Água | 2 | Dano na área de raio 1 e empurrão dos inimigos atingidos. |
| Terra | 1 | Dano na área de raio 1 e pedras no cone. |
| Ar | 3 | Dano na área de raio 1 e barreira no cone por 2 turnos. |

O dano dos inimigos comuns está configurado provisoriamente em 1 HP: uma explosão derrota um inimigo comum. Inimigos especiais poderão usar HP maior.
