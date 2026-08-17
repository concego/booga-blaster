# Plano de aproveitamento do Dino Crawler

## Regra

Booga Blaster deve aproveitar os sistemas já testados do Dino Crawler sem copiar o arquivo monolítico. A lógica será extraída por responsabilidade e adaptada ao novo jogo.

## Sistemas a aproveitar

- Movimentação em grade.
- Processamento de ações e turnos.
- Colisão com obstáculos.
- Resolução de ataques.
- Reação e movimentação dos inimigos.
- Scan da área ao redor do jogador.
- Atualização do log.
- Comunicação acessível com regiões vivas.
- Troca de seleção de arma, adaptada para elementos.

## Adaptações principais

### Entrada

No Dino Crawler, uma direção movimenta ou dispara conforme o modo de mira. Em Booga Blaster:

- Direção sem lançamento preparado: movimenta.
- Primeiro Lançar: prepara o disparo.
- Lançar seguido de direção: dispara naquela direção sem movimentar.
- Segundo Lançar: dispara na própria célula.

### Combate

O ataque direto será substituído por uma esfera mágica com efeito pendente:

- A esfera ocupa uma célula.
- A duração até explodir é processada pelo sistema de turnos.
- A explosão pode atingir várias células.
- A explosão pode ativar outras esferas.
- O efeito depende do elemento selecionado.

### Scan

A função de Scan será reutilizada como referência de comportamento e saída acessível. A implementação final deverá ler as entidades e os efeitos próprios de Booga Blaster.

## Estrutura planejada

```text
src/
  audio/
    ui-audio.js
  core/
    commands/
    grid/
    turns/
    combat/
  game/
    demo-state.js
    elements/
    spells/
    powerups/
    bosses/
    generation/
  ui/
    game-screen.js
    log.js
    scan.js
```

Cada pasta só deve ser criada quando houver responsabilidade real para separar. Não criar camadas vazias apenas por antecipação.

## Cuidados

- Não transportar o HTML monolítico do Dino Crawler para o novo projeto.
- Não misturar regras de apresentação com regras de turno.
- Não esconder a ordem do TalkBack atrás de uma reorganização visual.
- Manter o estado do jogo independente do SVG.
- Criar testes pequenos para movimento, lançamento, duração e dano antes de conectar a geração aleatória.
