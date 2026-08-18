# Power-ups e coletáveis

## Regra geral

Power-ups ativam imediatamente quando são encontrados. Não existe inventário nem botão separado de uso.

Power-ups temporários recebem uma duração em turnos. Um power-up repetido recarrega o efeito para a duração definida; não soma o tempo restante.

Corações são itens coletáveis separados dos power-ups. Um coração recupera 1 coração perdido, até o limite de 3.

## Catálogo inicial

| Tipo | Efeito | Duração |
|---|---|---|
| Vida extra | Aumenta o número de vidas | Permanente até ser consumida |
| Poção Fantasma | Permite atravessar blocos | A definir |
| Salamandra | Permite atravessar chamas sem dano | A definir; exemplo discutido: 8 turnos |
| Toupeira | Permite ocupar células afetadas por Terra sem dano | A definir |
| Super Força | Aumenta a distância de lançamento | A definir |
| Notícia ruim | Supimpus realiza 2 avanços enquanto os inimigos realizam 1 | 2 turnos |

## Fontes

- `map`: visível desde a criação da fase.
- `enemy-drop`: aparece ao derrotar um inimigo.
- `block-content`: revelado quando o bloco destrutível é quebrado.
- `chest`: revelado quando o baú é aberto.

Um item escondido não pode ser coletado antes de ser revelado. Depois de revelado, a coleta pode ativar o efeito imediatamente.

## Fixtures atuais

- Super Força visível no mapa.
- Notícia ruim visível no mapa, perto da posição inicial.
- Um coração visível no mapa.
- Um baú contém uma Salamandra.
- Um bloco destrutível contém uma Vida extra.
- O Troll de teste derruba uma Poção Fantasma.
- O Escoteiro de teste derruba Notícia ruim.

O modo temporário `?test=elements` mantém esses itens e libera os quatro elementos para validação.
