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
- Personalidade: quebra um bloco por turno quando não está adjacente a Supimpus;
- Restrição: só recebe dano de Fogo;
- Vida: 3 corações;
- Ao ser derrotado, conclui a arena e encerra a fase.

O catálogo de especiais é orientado a dados. Troll está disponível na fase 1; os especiais das fases seguintes serão adicionados sem reaproveitar regras ou sons de tipos diferentes.
