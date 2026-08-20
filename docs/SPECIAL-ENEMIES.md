# Inimigos especiais e arenas

## Regras

- Ao alcançar a célula do objetivo, Supimpus entra na arena do inimigo especial da fase.
- O especial tem 3 corações próprios.
- A fase só é concluída depois da derrota do especial.
- Inimigos invocados ficam vinculados ao especial e desaparecem quando ele é derrotado.
- A cada três fases, o especial será um Boss.

## Primeiro especial implementado

### Troll

- Arena própria com blocos quebráveis;
- Personalidade: tenta se aproximar para atacar;
- Quando o caminho direto até Supimpus está bloqueado por um bloco, quebra esse bloco em vez de ficar parado;
- Restrição: é imune ao dano dos outros elementos, mas seus efeitos de controle continuam funcionando:
  - Água empurra o Troll;
  - Ar impede o avanço do Troll;
  - as pedras de Terra não causam dano nem atordoam o Troll;
- Vida: 3 corações;
- Ao ser derrotado, conclui a arena e encerra a fase.

O catálogo de especiais é orientado a dados. O Troll pode reaparecer nas fases que não são Boss. A cada terceira fase, o encontro usa o Guardião do Bosque como Boss provisório, até que sua personalidade específica seja definida.

## Estrutura da campanha

- A campanha tem **21 fases** divididas em **7 ambientes**;
- Ambientes, na ordem da campanha: **Floresta**, **Subterrâneo**, **Planície**, **Vale**, **Montanha**, **Castelo** e **Torre de magia**;
- Cada ambiente tem 3 fases;
- As fases 1 e 2 de cada ambiente terminam com um especial fixo;
- A terceira fase de cada ambiente termina com o Boss fixo daquele ambiente;
- Assim, os Bosses ficam nas fases 3, 6, 9, 12, 15, 18 e 21.

## Escalonamento atual

- A quantidade de inimigos comuns começa em 3 e aumenta em 1 por fase, até o limite atual de 8;
- Todas as fases têm exatamente um encontro especial após o objetivo;
- Os elementos seguem a progressão existente: Fogo, depois Água, Terra e finalmente Ar;
- O seed e as regras do gerador definem aleatoriamente o mapa, blocos, inimigos comuns, itens e variação do Bosque;
- O especial e o Boss são definidos pela fase, independentemente do seed, e sempre aparecem na arena correspondente.
