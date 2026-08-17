# Inimigos — ciclo inicial

Cada ação que consome turno também permite uma ação dos inimigos.

## Ordem do turno

1. Supimpus movimenta-se ou lança uma magia.
2. O resultado da ação é resolvido: contato, dano, empurrão, pedras e zonas.
3. Cada inimigo age uma vez.
4. Efeitos de atordoamento, zonas e efeitos temporários são atualizados.

## Comportamento

- Se estiver adjacente a Supimpus, o inimigo ataca.
- Caso contrário, tenta avançar uma célula em direção a Supimpus.
- Não atravessa paredes, outros inimigos, Supimpus ou barreiras de Ar.
- Se estiver atordoado, perde a ação e o atordoamento é reduzido em 1 turno.
- Se não houver caminho livre, permanece no lugar neste turno.

## Dano e derrota

- O dano direto da explosão atual é 1 ponto.
- Inimigos comuns de teste possuem 1 ponto de vida e são derrotados por uma explosão.
- Inimigos especiais poderão possuir mais HP.
- Ao chegar a zero, o inimigo é removido do estado e deixa de agir.
- A barra de vida é exibida apenas no SVG decorativo; a informação acessível continua no status e no log.

## Sobrevivência

- Cada ataque recebido remove 1 coração.
- Três corações perdidos consomem uma vida e restauram os três corações.
- Ao perder a última vida, a partida entra em estado de fim de jogo.
- Não existe invencibilidade automática após dano.

Os valores ainda são provisórios para teste do ciclo de combate.
