# 019 Personalizações — Memória do Projeto

> Arquivo canônico de continuidade. Antes de qualquer alteração futura, ler este arquivo inteiro, conferir a versão atual e atualizar a seção **Histórico de versões** antes de publicar.

## 1. Objetivo do sistema

Sistema interno da Zero 19 para centralizar atendimento de empresas/clientes, artes, mockups, orçamentos, produção DTF, equipe, histórico e produtividade. Precisa funcionar bem no celular e no computador e servir também como ponte de arquivos entre os dois.

## 2. Regras de não regressão

1. Nunca remover uma função existente para incluir outra sem registrar e validar a substituição.
2. Alterações visuais devem ser feitas sem quebrar fluxo, banco, upload, orçamento, área pública ou permissões.
3. Antes de publicar: validar sintaxe JavaScript, estrutura do bundle, rotas principais e requisitos marcados como **IMPLEMENTADO** abaixo.
4. Não reintroduzir remoção automática de fundo. Ela foi retirada a pedido do usuário.
5. Não reduzir imagem original quando a opção de qualidade estiver ativa. Ampliação pode ser feita, redução não.
6. Mockup não deve passar por recorte de prancheta nem por ampliação automática.
7. Senha de funcionário nunca deve ser exibida ao administrador. Usar redefinição de senha.
8. Toda ação administrativa relevante deve preservar autoria quando houver suporte no banco.
9. Não publicar alteração nova por cima de uma etapa incompleta. Finalizar/testar a etapa atual primeiro.
10. Toda publicação deve gerar uma entrada nova no **Histórico de versões** deste arquivo.

## 3. Identidade e acesso

- Nome: **019 Personalizações**.
- Tema: escuro, laranja 019, visual limpo e profissional.
- Administrador principal: **Clovis**.
- E-mail administrativo atual: `ussloja@gmail.com`.
- Hospedagem principal: `https://019-personalizacoes.vercel.app`.
- Banco/Storage/Auth: Supabase do projeto já conectado.

## 4. Requisitos funcionais consolidados

### Empresas e atendimento

- **IMPLEMENTADO** criar, editar e excluir empresa.
- **IMPLEMENTADO** nome da empresa, cliente, telefone/WhatsApp, estado/UF, observações.
- **IMPLEMENTADO** status configuráveis.
- **IMPLEMENTADO** status iniciais: Em atendimento; Aguardando chegar o produto para realizar a personalização; Cliente não responde; Desistiu; Remarcado; Finalizado.
- **IMPLEMENTADO** alterar status no card e dentro da empresa.
- **IMPLEMENTADO** alerta após 24h sem mudança de status, exceto Finalizado.
- **IMPLEMENTADO** empresa atrasada sobe na lista e recebe destaque discreto.
- **IMPLEMENTADO** exibir tempo parado em horas/dias.
- **IMPLEMENTADO** botão WhatsApp no card.
- **IMPLEMENTADO** status Desistiu registra data e fica destacado.
- **IMPLEMENTADO** Remarcado pede data/hora e destaca quando chegar o retorno.
- **IMPLEMENTADO** ao sair de status terminal para status ativo, criar novo projeto da mesma empresa.
- **IMPLEMENTADO** responsável atual e usuário que cadastrou a empresa.
- **IMPLEMENTADO** botão “Puxar pra mim”, transferindo responsabilidade e abrindo WhatsApp com saudação.
- **IMPLEMENTADO** área da empresa mostra histórico de projetos e faturamento acumulado.

### Artes, qualidade e produção

- **IMPLEMENTADO** upload de uma ou várias imagens.
- **IMPLEMENTADO** nome individual por arquivo.
- **IMPLEMENTADO** editar nome, tipo e pasta.
- **IMPLEMENTADO** excluir arquivo.
- **IMPLEMENTADO** baixar PNG.
- **IMPLEMENTADO** salvar como imagem.
- **IMPLEMENTADO** visualização em fundo transparente, branco e preto.
- **IMPLEMENTADO** remoção de prancheta transparente pelo limite de pixels visíveis.
- **IMPLEMENTADO** preservação de bordas antialias/alpha para evitar cortar a arte.
- **IMPLEMENTADO** saída PNG com metadata 300 DPI.
- **IMPLEMENTADO** qualidade: Original, 4032px, 6000px e 8192px.
- **IMPLEMENTADO** nunca reduzir original maior que o alvo.
- **REMOVIDO DE PROPÓSITO** remoção automática de fundo.
- **IMPLEMENTADO** mockup separado das artes de produção e sem tratamento automático.

### Pastas e bibliotecas

- **IMPLEMENTADO** pastas por empresa.
- **IMPLEMENTADO** subpastas.
- **IMPLEMENTADO** criar, renomear e excluir pastas.
- **IMPLEMENTADO** modelos de pasta configuráveis.
- **IMPLEMENTADO** pastas padrão: Artes enviadas pelo cliente; Artes prontas; Logo da empresa; Mockups.
- **IMPLEMENTADO** imagem na pasta Logo da empresa aparece como logo do card da empresa.
- **IMPLEMENTADO** biblioteca interna de Artes, sem vínculo com cliente.
- **IMPLEMENTADO** biblioteca interna de Mockups, sem vínculo com cliente.
- **IMPLEMENTADO** bibliotecas aceitam pastas e subpastas e servem para transferência celular ↔ computador.
- **PENDENTE** importação recursiva de pasta do Google Drive por link, preservando subpastas e arquivos originais. Deve ser feito via integração autorizada/OAuth, não por scraping frágil.

### Orçamentos

- **IMPLEMENTADO** orçamento por empresa.
- **IMPLEMENTADO** área pública do cliente mostra orçamento.
- **IMPLEMENTADO** produto, quantidade, prazo de entrega e observações.
- **IMPLEMENTADO** preço total por peça personalizada OU peça + estampas separadas.
- **IMPLEMENTADO** múltiplas estampas por item.
- **IMPLEMENTADO** posições como frente, peito, costas, mangas etc.
- **IMPLEMENTADO** largura em centímetros; altura proporcional.
- **IMPLEMENTADO** catálogo configurável: editar, adicionar e excluir modelos.
- **IMPLEMENTADO** catálogo inicial: 30.1; Oversize Suedine; Oversize 100% algodão; Pima Egípcia; Malha Peruana; Cotton; Dry Fit Premium; Dry Fit com Poliamida.
- **IMPLEMENTADO** faturamento de finalização separado entre camisas, estampas e total.

### Área do cliente

- **IMPLEMENTADO** link compartilhável por empresa.
- **IMPLEMENTADO** cliente vê artes, mockups e orçamento.
- **IMPLEMENTADO** cliente pode baixar arquivos quando habilitado.
- **IMPLEMENTADO** cliente vê vendedor responsável.
- **IMPLEMENTADO** botão de WhatsApp do vendedor.
- **IMPLEMENTADO** horário de atendimento exibido como 9h às 18h.
- **PENDENTE** permitir que o cliente envie/anexe imagem diretamente na área pública, caso isso continue sendo desejado. Hoje a área pública é de visualização/download.

### Equipe e administração

- **IMPLEMENTADO** perfil de administrador e perfis de funcionários.
- **IMPLEMENTADO** administrador convida funcionário com nome, telefone e e-mail.
- **IMPLEMENTADO** funcionário define a própria senha no primeiro acesso.
- **IMPLEMENTADO** redefinição de senha pelo administrador via fluxo seguro.
- **IMPLEMENTADO** funcionários da mesma conta enxergam os mesmos clientes/empresas conforme RLS da equipe.
- **IMPLEMENTADO** usuário que cadastrou e responsável atual aparecem nos cards/empresa.
- **IMPLEMENTADO** histórico/auditoria de ações principais.
- **IMPLEMENTADO** anexos registram quem enviou.
- **IMPLEMENTADO** orçamento registra autoria.
- **IMPLEMENTADO** histórico de login disponível no banco e área administrativa.
- **NÃO IMPLEMENTAR** administrador visualizar senha do funcionário.

### Dashboard e produtividade

- **IMPLEMENTADO** filtros: hoje, ontem, últimos 7 dias, últimos 30 dias, mês passado, mês, data personalizada.
- **IMPLEMENTADO** filtro por vendedor.
- **IMPLEMENTADO** empresas/clientes cadastrados.
- **IMPLEMENTADO** empresas por estado/UF.
- **IMPLEMENTADO** projetos iniciados e finalizados.
- **IMPLEMENTADO** atendimentos ativos em tempo real.
- **IMPLEMENTADO** atendimentos vencidos/atenção +24h.
- **IMPLEMENTADO** desistências.
- **IMPLEMENTADO** faturamento camisas, estampas e total.
- **IMPLEMENTADO** resumo diário na página inicial.
- **IMPLEMENTADO** histórico de atividades no administrativo.

## 5. Pontos arquiteturais importantes

- Tabelas do sistema usam prefixo `z19p_` para não misturar com outras aplicações no mesmo Supabase.
- Arquivos ficam no bucket `z19p-assets`.
- O sistema possui RLS para equipe da mesma conta e autoria dos registros.
- Existe RPC pública `z19p_get_public_workspace` para a área do cliente.
- Existe Edge Function `z19p-team-admin` para convites, ativação/desativação e redefinição de senha da equipe.
- O front atual é carregado como bundle estático. Evitar patches temporários duplicando lógica já presente no bundle principal.
- O patch `team-patch.js` criado durante a fase de correção ficou redundante porque as mesmas funções passaram a existir no bundle principal. Na v2.3 ele deve ser neutralizado/removido para reduzir risco de duplicação.

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
- [ ] equipe/dashboard continuam acessíveis ao administrador
- [ ] área pública do cliente carrega vendedor, orçamento, mockups e artes
- [ ] nenhuma alteração visual remove função já existente

## 7. Pendências priorizadas

1. **Google Drive**: importar pasta recursivamente, preservar subpastas e arquivos originais.
2. **Upload pelo cliente** na área pública, se confirmado como requisito final.
3. **Consolidar código**: retirar overrides/monkey-patches antigos do `app.js` e gerar uma base única, depois de congelar comportamento atual com testes.
4. **Privacidade de arquivos**: bucket atual usa URLs públicas para facilitar compartilhamento. Evolução futura recomendada: bucket privado + URLs assinadas.
5. **Testes automatizados de smoke** para rotas e principais fluxos.

## 8. Histórico de versões

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
- Testes planejados/realizados: `node --check app.js`; conferir que o listener não referencia diretamente a função antiga; conferir metadado de versão 2.6; validar deploy antes de produção.

### v2.7 — Estabilidade de carregamento, tempo de status e pastas legíveis
- Pedido: corrigir a tela “Não foi possível carregar o sistema / Failed to fetch”, preservar o layout aprovado, mostrar há quanto tempo cada empresa está no status atual e parar de abreviar nomes de pastas.
- Causa do “Failed to fetch”: a v2.6 foi publicada como um wrapper que buscava outra URL de deployment em tempo de execução. Essa dependência cross-deployment era frágil e podia falhar no navegador.
- Correção estrutural: voltar ao `index.html` autocontido, com CSS e JavaScript do sistema dentro do próprio deploy. A produção não deve depender de buscar um deployment antigo para inicializar.
- Navegação: manter a correção da v2.6 (`hashchange` chama a implementação atual de `renderRoute` e `nav()` rerenderiza a rota atual).
- Tempo de status: toda empresa com status definido diferente de Finalizado mostra “Há Xh / X dias e Yh neste status”. O alerta especial de 24h continua separado e mantém prioridade visual/ordenação.
- Área da empresa: o mesmo tempo de status aparece junto ao controle de status e atualiza a cada minuto sem recarregar a página.
- Pastas: nomes passam a quebrar linha e reduzir levemente a tipografia quando necessário; não usar reticências para esconder o nome.
- Layout: nenhuma mudança de identidade visual global; preservar a base canônica v2.5.
- Arquivos afetados: `app.js`, `styles.css`, `index.html`, `PROJECT_MEMORY.md`. Nenhuma tabela, RLS ou regra de banco alterada.
- Validações locais: `node --check app.js`; apenas uma definição ativa de `nav`, um listener de `hashchange`, uma implementação override final de `renderRoute` e uma implementação override final de `renderWorkspaceCards`; `index.html` sem referência ao deployment antigo; remoção automática de fundo continua ausente.
- Limitação de teste: o container não resolve `esm.sh`, portanto a renderização autenticada completa precisa ser validada no preview/produção real; não declarar teste visual completo sem essa validação.

### v2.8 — Biblioteca de vídeos de demonstração e WhatsApp
- Pedido: criar um ambiente interno para guardar vídeos de demonstração de qualidade, organizar em pastas, baixar no celular/computador e encaminhar para clientes cadastrados pelo WhatsApp.
- Dashboard: novo card **Vídeos**, ao lado das bibliotecas Artes e Mockups, preservando o layout canônico.
- Biblioteca de vídeos: cria automaticamente o workspace interno `library_videos`, aceita MP4, MOV e WEBM, permite múltiplos uploads, nome do vídeo, escolha de pasta/subpasta, visualizar, renomear, mover, excluir e baixar o arquivo original.
- Limite atual: 50 MB por vídeo, alinhado ao limite do bucket `z19p-assets`.
- WhatsApp: cada vídeo possui o botão **Demonstrar**. Ao tocar, abre uma lista pesquisável das empresas/clientes cadastrados; clientes sem telefone ficam desabilitados. Ao escolher um cliente, abre o WhatsApp dele com uma mensagem pronta e o link público direto do vídeo.
- Mensagem identifica o usuário/vendedor logado quando o perfil está disponível.
- Banco/Storage: aplicada a migração `z19p_allow_demo_videos`, mantendo o bucket existente e adicionando MIME types `video/mp4`, `video/quicktime` e `video/webm`. A tabela `z19p_assets` já comporta `asset_type='video'`, então não foi necessária nova tabela.
- Área pública do cliente: vídeos da biblioteca interna NÃO são misturados automaticamente com artes/mockups do cliente; o envio é feito pelo botão Demonstrar/WhatsApp.
- Continuidade v2.7 preservada: carregamento autocontido sem dependência de deployment antigo, tempo no status e nomes completos de pastas continuam obrigatórios.
- Arquivos afetados: `app.js`, `styles.css`, `index.html`, `PROJECT_MEMORY.md`.
- Validações locais: `node --check app.js`; payload do deploy v2.8 contém CSS e JavaScript atuais; `index.html` de produção não deve buscar outro deployment em tempo de execução; bucket confirmado com os MIME types de vídeo.
- Regra: não publicar se a versão em preview voltar a mostrar `Failed to fetch` ou perder o layout canônico.

## 9. Próxima versão

Ao receber a próxima solicitação, criar **v2.9** neste arquivo antes de publicar e preservar o layout canônico v2.5/v2.7/v2.8.
