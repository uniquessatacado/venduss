# 019 Personalizações — Memória do Projeto

> Arquivo canônico de continuidade. Antes de qualquer alteração futura, ler este arquivo inteiro, conferir a versão atual e atualizar a seção **Histórico de versões** antes de publicar.

## 1. Objetivo e identidade

Sistema interno da **Zero 19 / 019 Personalizações** para centralizar atendimento de empresas/clientes, artes, mockups, orçamentos, produção DTF, equipe, histórico e produtividade. Precisa funcionar bem no **celular e no computador** e também servir como ponte de arquivos entre os dois.

- Nome do sistema: **019 Personalizações**.
- Tema: escuro, laranja 019, visual limpo e profissional.
- Administrador principal: **Clovis**.
- Produção: `https://019-personalizacoes.vercel.app`.
- Banco/Storage/Auth: Supabase já conectado.
- Layout canônico: base do ZIP aprovado pelo usuário, preservada desde v2.5.

## 2. Regras de não regressão

1. Nunca remover função existente para incluir outra sem registrar e validar a substituição.
2. Alterações visuais não podem quebrar banco, upload, orçamento, área pública, permissões ou equipe.
3. Antes de publicar: validar sintaxe JavaScript, rotas principais e checklist desta memória.
4. Não reintroduzir remoção automática de fundo.
5. Não reduzir imagem original quando qualidade estiver ativa; apenas ampliar quando necessário.
6. Mockup não passa por recorte de prancheta nem ampliação automática.
7. Senha de funcionário nunca fica visível ao administrador; usar redefinição de senha.
8. Toda ação administrativa relevante preserva autoria quando houver suporte no banco.
9. Finalizar e testar a etapa atual antes de iniciar/publicar outra.
10. Toda publicação gera nova entrada no histórico de versões.
11. Ajustes visuais devem ser cirúrgicos: não compactar globalmente topbar, títulos, cards, botões ou tipografia sem comparar com o layout aprovado anterior.
12. Se uma alteração visual degradar a experiência, restaurar primeiro o último layout aprovado e só depois reaplicar a correção necessária isoladamente.
13. O ZIP enviado pelo usuário na v2.5 é a referência visual principal. Função nova deve entrar dentro dessa linguagem visual, sem redesenhar o sistema inteiro.
14. Antes de alterar navegação/rotas, conferir se existe implementação duplicada/override de `renderRoute`, `shell`, `renderDashboard` ou funções equivalentes.

## 3. Requisitos consolidados

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

## 4. Arquitetura importante

- Tabelas usam prefixo `z19p_`.
- Storage usa bucket `z19p-assets`.
- RLS permite equipe da mesma conta e preserva autoria.
- Área pública usa RPC `z19p_get_public_workspace`.
- Equipe usa Edge Function `z19p-team-admin`.
- `index.html` v2.5+ é autocontido: CSS + JavaScript da aplicação no próprio HTML para evitar tela sem estilo quando um patch externo falha.
- `app.js` deve continuar espelhando a lógica principal do `index.html` para manutenção e validação de sintaxe.
- Evitar patches temporários duplicando lógica já presente no app principal.
- O patch `team-patch.js` ficou redundante depois que as mesmas funções passaram ao bundle principal; v2.3 o neutralizou.
- `team-patch.css` não deve redesenhar globalmente a aplicação.

## 5. Itens pendentes

1. Google Drive: importar pasta recursivamente preservando subpastas e arquivos originais.
2. Upload pelo cliente na área pública, se confirmado.
3. Consolidar o `app.js` removendo overrides antigos após congelar comportamento com testes.
4. Evoluir bucket público para privado + URLs assinadas quando for priorizada segurança de arquivo.
5. Criar smoke tests automatizados das rotas e fluxos principais.
6. Substituir o placeholder textual atual pelo **logo oficial da Zero 19** quando o arquivo oficial for enviado. O usuário informou que a marca usa o **zero escrito**, não o numeral `0` como representação do logo.

## 6. Checklist obrigatório antes de publicar

- [ ] `node --check app.js`
- [ ] busca por opção de remoção automática de fundo deve retornar zero na interface
- [ ] login abre normalmente
- [ ] dashboard carrega sem overflow horizontal
- [ ] filtro de status não sai da tela no mobile
- [ ] card de empresa mostra status, responsável, WhatsApp e ações
- [ ] editar/excluir empresa continua disponível
- [ ] abrir empresa funciona
- [ ] pastas/subpastas continuam funcionando
- [ ] upload de arte mantém recorte/prancheta + opções de qualidade
- [ ] mockup não é processado como arte
- [ ] editar/excluir/baixar arte continua funcionando
- [ ] orçamento abre, salva e aparece na área pública
- [ ] Equipe abre ao clicar sem precisar atualizar a página
- [ ] Dashboard/Produtividade abre ao clicar sem precisar atualizar a página
- [ ] Ver produtividade no resumo diário abre ao clicar
- [ ] área pública do cliente carrega vendedor, orçamento, mockups e artes
- [ ] nenhuma alteração visual remove função já existente

## 7. Histórico de versões

### v1.0 — Base
- Login, empresas, upload e armazenamento no Supabase.
- Área do cliente e arquivos PNG.

### v1.1 — Produção de arte
- Recorte de prancheta transparente.
- PNG 300 DPI.
- Qualidade 4032/6000/8192.
- Mockup separado.
- Editar/excluir/renomear/download de arquivos.
- Remoção automática de fundo retirada.

### v1.2 — Comercial
- Status configuráveis.
- Catálogo de produtos.
- Orçamentos e área pública do orçamento.
- WhatsApp no card.

### v1.3 — Organização
- Pastas padrão, subpastas, Logo da empresa, Artes prontas e Artes enviadas pelo cliente.
- Bibliotecas internas de Artes e Mockups.

### v1.4 — Controle de atendimento
- Alerta de 24h sem alteração de status.
- Ordenação das empresas pendentes para o topo.
- Destaque/WhatsApp para retorno.

### v2.0 — Equipe e projetos
- Administrador, funcionários e primeiro acesso.
- Responsável atual, “Puxar pra mim” e autoria.
- Histórico de ações.
- Projetos recorrentes por empresa.
- Desistiu e Remarcado.
- Faturamento por camisa/estampa/total.
- Dashboard de produtividade.

### v2.1 — Indicadores
- Estado/UF no cadastro.
- Empresas por estado no dashboard.
- Histórico de projetos e totais por cliente.
- Vendedor responsável na área pública.

### v2.2 — Correções incrementais
- Ajustes de RLS da equipe e Storage.
- Ajustes de auditoria e primeiro acesso.
- Patch temporário de estado/histórico criado durante estabilização.

### v2.3 — Estabilização visual e memória do projeto
- Criado este arquivo canônico `PROJECT_MEMORY.md`.
- Revisão completa dos requisitos antigos contra o código atual.
- Identificados explicitamente os itens ainda pendentes: Google Drive e upload público do cliente.
- Decisão de não reescrever o sistema inteiro durante a correção visual.
- Remoção/neutralização de patch JavaScript redundante para evitar dupla execução.
- Limpeza visual não destrutiva por CSS: menos poluição, melhor hierarquia, cards e filtros responsivos.
- Fortalecimento da regra de não regressão e checklist de publicação.
- Auditoria encontrou `Cotton` ausente do catálogo do banco; item foi cadastrado novamente e validado na ordem correta.

### v2.4 — Restauração do layout aprovado
- Causa: a compactação global do `team-patch.css` v2.3 sobrescreveu tamanhos do layout aprovado.
- Correção: restauração do visual anterior e manutenção apenas de correções pontuais de overflow e estilos novos de UF/histórico.
- Preservado: equipe, dashboard, status, WhatsApp, alerta 24h, orçamento, pastas, artes, mockups e projetos.
- Banco e regras de negócio não alterados nesta versão.

### v2.5 — Reconstrução usando o ZIP de layout aprovado
- O usuário enviou um ZIP da fase em que o layout estava aprovado e pediu que ele passasse a ser a referência visual canônica.
- Referência: `styles.css` do ZIP enviado, SHA-256 `1d7789662daaf1336d83e66615b2a97a3db808c4a5d878463f58c9f0e1956400`.
- Conferência técnica: o `styles.css` atual contém integralmente essa base aprovada no início do arquivo; os estilos das funções posteriores são aditivos.
- Causa do layout quebrado/sem estilo vista no celular: produção dependia de bundle comprimido e patches externos; o conteúdo do app podia renderizar sem a folha visual completa ficar aplicada.
- Correção de emergência: `team-patch.css` passou a carregar o CSS completo baseado na referência aprovada, para impedir tela sem estilo no deploy atual.
- Correção estrutural preparada: `index.html` autocontido com CSS e JavaScript completos, sem depender de `team-bundle.*`, `team-patch.css` ou `team-patch.js`.
- Funcionalidades preservadas: empresas, editar/excluir, status, WhatsApp, alerta 24h, orçamento, pastas/subpastas, Logo da empresa, Artes prontas, Artes enviadas pelo cliente, bibliotecas Artes/Mockups, equipe, responsável, Puxar pra mim, auditoria, projetos, Remarcado, Desistiu, UF, produtividade e área do cliente.
- Regra permanente: alterações visuais futuras partem desta base; não redesenhar globalmente o sistema para incluir função nova.
- Testes feitos nesta etapa: `node --check app.js`; validação de presença do CSS de autenticação; confirmação de que o novo `index.html` não referencia chunks ou patches externos; comparação de hash/prefixo entre CSS aprovado e CSS atual.

### v2.6 — Navegação imediata e preparação do logo oficial
- Pedido: corrigir os botões **Equipe**, **Dashboard/Produtividade** e **Ver produtividade**, que alteravam a URL mas só renderizavam a tela depois de atualizar manualmente.
- Causa identificada: o listener de `hashchange` foi registrado apontando para uma versão antiga de `renderRoute`; depois `renderRoute` foi substituída pelas rotas novas de Equipe/Produtividade, mas o navegador continuava chamando a função antiga já registrada.
- Correção: o listener agora chama `renderRoute()` dinamicamente no momento do evento, então usa sempre a implementação atual.
- Reforço: `nav()` agora também renderiza novamente quando o usuário toca em um botão que aponta para a rota em que ele já está.
- Arquivos afetados: `app.js` e `index.html`. Nenhuma tabela, RLS ou regra de negócio foi alterada.
- Layout: nenhuma mudança visual global nesta versão; manter integralmente a base aprovada v2.5.
- Marca: usuário informou que o logo oficial usa o nome/zero escrito, não um numeral `0`. O placeholder atual `019` deve ser substituído somente quando o arquivo oficial do logo for enviado, sem redesenhar a interface.
- Testes realizados: `node --check app.js`; comparação direta contra v2.5 confirmou que `index.html` mudou apenas em versão e navegação/`hashchange`; listener antigo direto não permanece.

## 8. Próxima versão

Ao receber a próxima solicitação, criar **v2.7** neste arquivo antes de publicar e preservar o layout canônico v2.5/v2.6.
