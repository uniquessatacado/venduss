# 019 Personalizações — Memória do Projeto

> Arquivo canônico de continuidade. Antes de qualquer alteração futura, ler este arquivo inteiro, conferir a versão atual e atualizar a seção **Histórico de versões** antes de publicar.

## Objetivo
Sistema interno da Zero 19 para centralizar atendimento de empresas/clientes, artes, mockups, orçamentos, produção DTF, equipe, histórico e produtividade. Precisa funcionar bem no celular e no computador e servir também como ponte de arquivos entre os dois.

## Regras de não regressão
1. Nunca remover função existente para incluir outra sem registrar e validar a substituição.
2. Alterações visuais não podem quebrar banco, upload, orçamento, área pública, permissões ou equipe.
3. Antes de publicar: validar sintaxe JavaScript, bundle, rotas principais e checklist desta memória.
4. Não reintroduzir remoção automática de fundo.
5. Não reduzir imagem original quando qualidade estiver ativa; apenas ampliar quando necessário.
6. Mockup não passa por recorte de prancheta nem ampliação automática.
7. Senha de funcionário nunca fica visível ao administrador; usar redefinição de senha.
8. Toda ação administrativa relevante preserva autoria quando houver suporte no banco.
9. Finalizar e testar a etapa atual antes de iniciar/publicar outra.
10. Toda publicação gera nova entrada no histórico de versões.
11. Ajustes visuais devem ser cirúrgicos: não compactar globalmente topbar, títulos, cards, botões ou tipografia sem comparar com o layout aprovado anterior.
12. Se uma alteração visual degradar a experiência, restaurar primeiro o último layout aprovado e só depois reaplicar a correção necessária isoladamente.

## Identidade e acesso
- Nome: **019 Personalizações**.
- Tema: escuro, laranja 019, visual limpo e profissional.
- Administrador principal: **Clovis**.
- Hospedagem: `https://019-personalizacoes.vercel.app`.
- Banco/Storage/Auth: Supabase já conectado.

## Requisitos consolidados

### Empresas e atendimento
- IMPLEMENTADO: criar, editar e excluir empresa.
- IMPLEMENTADO: empresa, cliente, telefone/WhatsApp, estado/UF e observações.
- IMPLEMENTADO: status configuráveis.
- IMPLEMENTADO: Em atendimento; Aguardando chegar o produto para realizar a personalização; Cliente não responde; Desistiu; Remarcado; Finalizado.
- IMPLEMENTADO: alterar status no card e dentro da empresa.
- IMPLEMENTADO: alerta após 24h sem mudança de status, exceto Finalizado.
- IMPLEMENTADO: empresa atrasada sobe na lista e recebe destaque discreto.
- IMPLEMENTADO: tempo parado em horas/dias.
- IMPLEMENTADO: WhatsApp no card.
- IMPLEMENTADO: Desistiu registra data e fica destacado.
- IMPLEMENTADO: Remarcado pede data/hora e destaca no retorno.
- IMPLEMENTADO: status terminal voltando a ativo abre novo projeto da mesma empresa.
- IMPLEMENTADO: usuário que cadastrou + responsável atual.
- IMPLEMENTADO: “Puxar pra mim”, transferindo responsabilidade e abrindo WhatsApp com saudação.
- IMPLEMENTADO: histórico de projetos e faturamento acumulado na empresa.

### Artes, qualidade e produção
- IMPLEMENTADO: upload de uma ou várias imagens.
- IMPLEMENTADO: nome individual, editar nome/tipo/pasta, excluir.
- IMPLEMENTADO: baixar PNG e salvar como imagem.
- IMPLEMENTADO: fundo transparente/branco/preto para visualização.
- IMPLEMENTADO: remoção de prancheta transparente pelo limite de pixels visíveis preservando bordas alpha/antialias.
- IMPLEMENTADO: PNG com metadata 300 DPI.
- IMPLEMENTADO: Original, 4032px, 6000px e 8192px.
- IMPLEMENTADO: nunca reduzir original maior que o alvo.
- REMOVIDO DE PROPÓSITO: remoção automática de fundo.
- IMPLEMENTADO: mockup separado e sem tratamento de arte.

### Pastas e bibliotecas
- IMPLEMENTADO: pastas por empresa, subpastas, renomear e excluir.
- IMPLEMENTADO: modelos de pasta configuráveis.
- IMPLEMENTADO: Artes enviadas pelo cliente; Artes prontas; Logo da empresa; Mockups.
- IMPLEMENTADO: logo da pasta especial aparece no card da empresa.
- IMPLEMENTADO: biblioteca interna de Artes.
- IMPLEMENTADO: biblioteca interna de Mockups.
- IMPLEMENTADO: bibliotecas servem para transferência celular ↔ computador.
- PENDENTE: importação recursiva do Google Drive por link preservando pastas/subpastas e arquivos; fazer via integração autorizada/OAuth.

### Orçamentos
- IMPLEMENTADO: orçamento por empresa e visualização na área do cliente.
- IMPLEMENTADO: produto, quantidade, prazo de entrega e observações.
- IMPLEMENTADO: valor total por peça personalizada OU peça + estampas separadas.
- IMPLEMENTADO: múltiplas estampas, posição e largura em centímetros; altura proporcional.
- IMPLEMENTADO: catálogo configurável.
- IMPLEMENTADO: 30.1; Oversize Suedine; Oversize 100% algodão; Pima Egípcia; Malha Peruana; Cotton; Dry Fit Premium; Dry Fit com Poliamida.
- IMPLEMENTADO: faturamento final separado entre camisas, estampas e total.

### Área do cliente
- IMPLEMENTADO: link compartilhável.
- IMPLEMENTADO: cliente vê artes, mockups e orçamento.
- IMPLEMENTADO: download quando habilitado.
- IMPLEMENTADO: vendedor responsável, WhatsApp e horário 9h às 18h.
- PENDENTE: upload/anexo feito diretamente pelo cliente na área pública, caso continue desejado. Hoje é visualização/download.

### Equipe e administração
- IMPLEMENTADO: administrador e funcionários.
- IMPLEMENTADO: convite com nome, telefone e e-mail; funcionário define senha no primeiro acesso.
- IMPLEMENTADO: redefinição segura de senha.
- IMPLEMENTADO: equipe da mesma conta enxerga os mesmos clientes conforme RLS.
- IMPLEMENTADO: autoria, responsável atual, anexos e orçamento registram usuário.
- IMPLEMENTADO: histórico/auditoria e login.
- NÃO IMPLEMENTAR: administrador visualizar senha do funcionário.

### Dashboard e produtividade
- IMPLEMENTADO: hoje, ontem, 7 dias, 30 dias, mês passado, mês e período personalizado.
- IMPLEMENTADO: filtro por vendedor.
- IMPLEMENTADO: clientes/empresas cadastrados e empresas por UF.
- IMPLEMENTADO: projetos iniciados/finalizados, atendimentos ativos, atenção +24h, desistências.
- IMPLEMENTADO: faturamento de camisas, estampas e total.
- IMPLEMENTADO: resumo diário e histórico de atividades.

## Arquitetura importante
- Tabelas usam prefixo `z19p_`.
- Storage usa bucket `z19p-assets`.
- RLS permite equipe da mesma conta e preserva autoria.
- Área pública usa RPC `z19p_get_public_workspace`.
- Equipe usa Edge Function `z19p-team-admin`.
- Evitar patches temporários duplicando lógica já presente no bundle principal.
- O patch `team-patch.js` ficou redundante depois que as mesmas funções passaram ao bundle principal; v2.3 o neutralizou.
- `team-patch.css` deve ser somente aditivo e pontual; não deve redesenhar globalmente a aplicação.

## Checklist antes de publicar
- node --check app.js
- remoção automática de fundo não aparece na interface
- login abre
- dashboard sem overflow horizontal
- filtro de status não sai da tela no mobile
- card mostra status, responsável, WhatsApp e ações
- editar/excluir empresa funciona
- abrir empresa funciona
- pastas/subpastas funcionam
- upload de arte mantém recorte + qualidade
- mockup não recebe tratamento de arte
- editar/excluir/baixar arte funciona
- orçamento salva e aparece na área pública
- equipe/dashboard continuam acessíveis ao admin
- área pública carrega vendedor, orçamento, mockups e artes
- nenhuma alteração visual remove função existente
- comparar desktop e mobile com o último layout aprovado antes de publicar CSS global

## Pendências priorizadas
1. Google Drive: importar pasta recursivamente preservando subpastas e arquivos originais.
2. Upload pelo cliente na área pública, se confirmado.
3. Consolidar o `app.js` removendo overrides antigos após congelar comportamento com testes.
4. Evoluir bucket público para privado + URLs assinadas quando for priorizada segurança de arquivo.
5. Criar smoke tests automatizados das rotas e fluxos principais.

## Histórico de versões

### v1.0 — Base
Login, empresas, upload, Supabase, área do cliente e arquivos PNG.

### v1.1 — Produção de arte
Recorte de prancheta; PNG 300 DPI; 4032/6000/8192; mockup separado; editar/excluir/renomear/download; remoção automática de fundo retirada.

### v1.2 — Comercial
Status, catálogo, orçamento, área pública do orçamento e WhatsApp no card.

### v1.3 — Organização
Pastas padrão, subpastas, Logo da empresa, Artes prontas, Artes enviadas pelo cliente, bibliotecas de Artes e Mockups.

### v1.4 — Controle de atendimento
Alerta de 24h, ordenação das pendências para o topo e destaque/WhatsApp para retorno.

### v2.0 — Equipe e projetos
Administrador, funcionários, primeiro acesso, responsável atual, “Puxar pra mim”, auditoria, projetos recorrentes, Desistiu, Remarcado, faturamento e dashboard.

### v2.1 — Indicadores
UF, empresas por estado, histórico de projetos, totais por cliente e vendedor na área pública.

### v2.2 — Correções incrementais
RLS da equipe e Storage, auditoria, primeiro acesso e patch temporário de estado/histórico.

### v2.3 — Estabilização visual e memória do projeto
- Criado este arquivo canônico.
- Revisados todos os requisitos anteriores contra o código atual.
- Pendências explicitadas: Google Drive e upload público do cliente.
- Patch JavaScript redundante neutralizado para evitar dupla execução.
- Foi aplicada uma compactação visual global por CSS; validação real mostrou que ela degradou o layout aprovado anterior.
- Auditoria encontrou `Cotton` ausente do catálogo do banco; item foi cadastrado novamente.

### v2.4 — Restauração do layout aprovado
- Pedido: recuperar o visual anterior sem perder as funções novas.
- Causa identificada: `team-patch.css` v2.3 sobrescreveu globalmente topbar, títulos, cards, botões, grids e tipografia com muitos `!important`.
- Ação: retirar a compactação global e voltar o patch CSS ao papel original, apenas complementando blocos novos e o overflow do filtro de status.
- Preservar integralmente: equipe, dashboard, UF, histórico, responsável, status, WhatsApp, alerta 24h, orçamento, pastas, artes e mockups.
- Banco e regras de negócio não serão alterados nesta correção visual.

## Próxima versão
Na próxima solicitação, criar **v2.5** antes de publicar e registrar: pedido, arquivos/tabelas afetados, mudanças, testes e pendências.
