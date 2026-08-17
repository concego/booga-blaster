# Booga Blaster — tela de jogo

## Regra principal

A ordem e a estrutura abaixo são o contrato da tela para o TalkBack. A composição visual pode ser reorganizada para facilitar a leitura de quem enxerga, mas não deve alterar a ordem semântica, os nomes dos comandos ou a lógica de interação.

## Ordem do TalkBack

1. **Nome da fase**
   - Exemplo: `Bosque Espinhoso`.

2. **Número de vidas**

3. **Efeitos ativos e duração**
   - Cada efeito informa o número de turnos restantes.
   - Se não houver efeito, informar que não há efeito ativo.

4. **Elementos**
   - Fogo.
   - Água.
   - Terra.
   - Ar.
   - Elementos ainda não desbloqueados ficam desativados.
   - O elemento selecionado deve ser identificado por estado, sem depender somente de cor ou imagem.

5. **Comandos de direção**
   - Norte.
   - Sul.
   - Oeste.
   - Leste.

6. **Lançar**
   - Primeiro acionamento prepara o lançamento.
   - Depois de preparar, uma seta direcional escolhe o sentido do disparo; nesse contexto, a seta não movimenta o jogador.
   - Dois acionamentos consecutivos de Lançar atingem a célula do próprio jogador.
   - Fora do estado de lançamento preparado, as setas continuam sendo comandos de movimento.

7. **Scan**
   - Mantém a mesma função do Dino Crawler: informar o que existe ao redor do jogador.

8. **Log**
   - Exibir quatro mensagens por vez.
   - Ordem do mais recente para o mais antigo.
   - Mensagens de partida devem ser curtas; explicações completas ficam no menu de ajuda.

## Teclado

- Setas: movimentam o jogador.
- `C`: prepara o lançamento; pressionar `C` novamente atinge a própria célula.
- Depois de `C`, uma seta escolhe a direção do disparo sem movimentar o jogador.
- `L`: informa o número de vidas.
- `1`, `2`, `3`, `4`: selecionam Fogo, Água, Terra e Ar.
- `S`: executa o Scan.
- Elementos bloqueados continuam sem seleção até serem desbloqueados.

## Princípios de texto

Durante a partida, o texto deve ser mínimo e objetivo. Exemplos:

- `Fogo selecionado.`
- `Salamandra: 5 turnos.`
- `Lançar preparado.`
- `Fogo lançado para leste.`
- `Scan concluído.`
- `Coração perdido. 2 de 3.`

O menu de ajuda explica os efeitos dos elementos, power-ups, vidas, corações, comandos e regras gerais.

## Apresentação visual

A tela pode usar SVG detalhado para representar a fase, Supimpus, blocos, esferas, criaturas e efeitos elementais. O mapa visual não deve criar uma segunda ordem de leitura conflitante: a informação para o TalkBack vem dos controles, do estado textual e do Scan.

O SVG pode ser decorativo ou ter camadas visuais, mas não deve ser a única fonte de informação sobre estado, perigo, posição ou objetivo.

## Áudio

- Sons de confirmação, seleção, movimento, Scan e outros cues curtos podem ser gerados com Web Audio API.
- Música e efeitos mais elaborados podem ser arquivos substituíveis.
- Nenhuma informação essencial pode depender somente de áudio.
- Sons de interface devem acompanhar a ativação de ações, não cada mudança de foco do TalkBack.

## Protótipo

A primeira tela está implementada como uma página estática em `index.html`, com:

- Estrutura semântica na ordem definida.
- Arena visual em SVG.
- Elementos bloqueados como botões desativados.
- Fluxo Lançar → direção ou Lançar → Lançar.
- Scan demonstrativo.
- Log limitado às quatro mensagens mais recentes.
- Cues básicos sintetizados com Web Audio API.
