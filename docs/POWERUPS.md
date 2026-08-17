# Power-ups

## Regra geral

Power-ups ativam imediatamente quando são encontrados. Não existe inventário nem botão separado de uso.

Power-ups temporários recebem uma duração em turnos. Um power-up repetido recarrega o efeito para a duração definida; não soma o tempo restante.

## Fontes

- `map`: visível desde a criação da fase.
- `enemy-drop`: aparece ao derrotar um inimigo.
- `block-content`: revelado quando o bloco destrutível é quebrado.
- `chest`: revelado quando o baú é aberto.

Um item escondido não pode ser coletado antes de ser revelado. Depois de revelado, a coleta pode ativar o efeito imediatamente.

## Catálogo inicial

| Tipo | Efeito | Duração |
|---|---|---|
| Vida extra | Aumenta o número de vidas | Permanente até ser consumida |
| Poção Fantasma | Permite atravessar blocos | A definir |
| Salamandra | Permite atravessar chamas sem dano | A definir; exemplo discutido: 8 turnos |
| Toupeira | Permite ocupar células afetadas por Terra sem dano | A definir |
| Super Força | Aumenta a distância de lançamento | A definir |

## Implementação

- `powerup-catalog.js`: tipos e nomes.
- `powerup-sources.js`: origens e criação de itens.
- `powerup-reveal.js`: revelação de conteúdos escondidos.
- `powerup-system.js`: ativação, recarga e coleta.

As durações ainda não são fixadas no catálogo até que o balanceamento de cada efeito seja decidido.
