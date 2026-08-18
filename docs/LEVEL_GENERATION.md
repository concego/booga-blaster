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

## Dificuldade

- Nível 1: três inimigos.
- Nível 2: quatro inimigos.
- Nível 3 ou superior: cinco inimigos.
- O modo `?test=elements` usa cinco inimigos duráveis para testar os quatro elementos.

A semente permite registrar uma fase problemática e reproduzi-la para ajuste de equilíbrio. A geração é procedural, mas a validação rejeita qualquer layout que viole os critérios acima.
