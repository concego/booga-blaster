# Anúncios acessíveis

## Regra geral

Uma ação deve ter um anúncio principal, não várias regiões repetindo a mesma mensagem.

## Canais

- `action-status`: região live para o resultado imediato da ação atual.
- `effects-announcer`: região live separada para ativação, recarga ou término de efeitos.
- `log-list`: histórico visual e consultável; não anuncia automaticamente cada atualização.
- SVG da arena: apresentação visual, totalmente oculto do fluxo do TalkBack.

## Comportamentos

- Movimento anuncia o resultado no `action-status`.
- Lançamento anuncia o resultado no `action-status`.
- Scan anuncia o resumo no `action-status` e registra os achados no log sem duplicar a fala.
- Vidas são anunciadas quando o jogador usa o atalho `L` ou quando uma ação altera vidas.
- Efeitos não são anunciados a cada turno; apenas ao ativar, recarregar ou terminar.
- O log continua disponível para consulta manual na ordem mais recente → mais antiga.
