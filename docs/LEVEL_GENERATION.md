# Geração de fases

O gerador cria fases de grade `9 × 5` com uma semente. A URL aceita `?seed=...` para repetir uma fase e `?level=2` para aumentar a quantidade de inimigos.

## Critérios obrigatórios

- Supimpus começa em uma célula livre.
- O Boss tem uma posição-alvo livre e alcançável.
- Existe uma rota crítica garantida até o objetivo.
- O início tem pelo menos duas saídas livres.
- A área alcançável tem pelo menos 24 células.
- Blocos, inimigos, itens e baús não ocupam a célula inicial nem o objetivo.
- Inimigos não surgem colados ao jogador nem ao objetivo.
- Conteúdos de baús ocupam a mesma célula do baú de propósito e só ficam revelados quando o baú é aberto.

## Progressão de elementos e dificuldade

O número usado em `level` representa a fase/progressão do jogador:

- Fase 1: apenas Fogo; três inimigos.
- Fase 2: Fogo e Água; quatro inimigos.
- Fase 3: Fogo, Água e Terra; cinco inimigos.
- Fase 4 em diante: Fogo, Água, Terra e Ar; mecânicas podem combinar todos os elementos.
- O modo `?test=elements` ignora o desbloqueio e usa os quatro elementos com cinco inimigos duráveis.

O gerador nunca deve criar uma resistência, imunidade, bloco ou objetivo que exija um elemento ainda bloqueado. Essa validação será aplicada às regras especiais dos biomas.

A semente permite registrar uma fase problemática e reproduzi-la para ajuste de equilíbrio. A geração é procedural, mas a validação rejeita qualquer layout que viole os critérios acima.
