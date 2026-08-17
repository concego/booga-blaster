# Áudio de teste

O protótipo usa a Web Audio API para validar o ritmo da gameplay antes da escolha ou produção de arquivos de áudio finais.

## Eventos cobertos

- seleção de elemento;
- preparação e lançamento de magia;
- movimento de Supimpus;
- movimento de inimigo;
- bloqueio de movimento;
- Scan;
- inimigo atingido;
- inimigo derrotado;
- ataque recebido;
- perda de vida;
- fim de jogo.

Os sons são curtos, gerados por osciladores e ativados somente depois de uma interação do usuário, respeitando a política de reprodução dos navegadores. Eles servem para testar feedback e ritmo, não são a identidade sonora final do jogo.

A camada de áudio não adiciona fala nem informação paralela obrigatória. O texto acessível continua sendo a fonte principal do estado da partida.
