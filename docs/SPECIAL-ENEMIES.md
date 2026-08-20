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

O catálogo de especiais é orientado a dados. Troll está disponível na fase 1; os especiais das fases seguintes serão adicionados sem reaproveitar regras ou sons de tipos diferentes.
