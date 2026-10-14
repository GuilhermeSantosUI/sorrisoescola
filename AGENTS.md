# AGENTS.md: Sorriso na Escola

## Contexto do produto
App educativo de saúde bucal para crianças, projeto de extensão da UNIT com a Nossa Escola (Aracaju/SE). **pt-BR, somente tema claro.**
- Público: turma de 23 crianças de 10 a 11 anos (uma neurodivergente → acessibilidade é requisito), 2 professores e os pais.
- Objetivo: ensinar escovação, fio dental e cuidados diários; permitir ao professor reforçar o tema depois.
- Conteúdo: vídeos/tutoriais curtos, jogos, quiz gamificado, mascote (hipopótamo turquesa).
- Escola tem projetor, tela e computador; **sem tablets por aluno** → uso em sala é coletivo, conduzido pelo professor (`apps/web`, `/sala`). Em casa: criança + pais (`apps/mobile`).
- Todo conteúdo de saúde é validado pela Odontologia antes de publicar. Uma semana depois, a equipe coleta feedback (`shared/src/feedback.ts`).

## Arquitetura
```
apps/web      React + Vite + Tailwind v4 (PWA): /sala, /professor, /marca
apps/mobile   Expo + expo-router (abas nativas): uso em casa
apps/api      fora do escopo; só consumimos o openapi.json
packages/shared  tokens, conteúdo, regras do quiz, cliente de API tipado
assets/brand  logo, mascote e variações
```
Os apps **só** falam com a API via `packages/shared/src/api` (`createSync`). Regras de domínio (quiz, progresso, código da turma) ficam no `shared`, nunca duplicadas nos apps.

## Mudar um endpoint
1. Alterar controller/DTO na API.
2. `pnpm api:types` (use `OPENAPI_URL=... pnpm api:types` para baixar o spec novo), atualiza `openapi.json` e `schema.ts`.
3. Ajustar `shared/src/api` (`sync.ts`, `mappers.ts`).
4. Consumir pelo client tipado nas telas. A CI falha se `schema.ts`/`openapi.json` estiverem desatualizados.
> Hoje `openapi.json` é um **placeholder escrito à mão** até a API publicar o real.

## Publicar conteúdo
Criar o módulo em `packages/shared/src/data/modules/`, validar com a Odontologia e preencher `validadoPor` e `validadoEm`. Sem isso o módulo **não aparece** (exceto com `VITE_SHOW_UNVALIDATED=true` / `EXPO_PUBLIC_SHOW_UNVALIDATED=true`, só em dev). Marque o que não foi revisado com `TODO: validar com Odontologia`.

## Tokens e tema
`packages/shared/src/tokens.ts` é a fonte única. O `@theme` de `apps/web/src/index.css` é **gerado** por `pnpm theme:sync` (`pnpm theme:check` na CI). `apps/mobile/src/constants/theme.ts` só reexporta. Nada de cor literal em componente (o ESLint bloqueia hex em `apps/`).
Branco sobre turquesa/limão/amarelo **não** passa AA; texto usa `petroleoEscuro` (`#2B484F`, tom de apoio: TODO aprovar).

## Marca, ícones e animação
- Variações da logo são **geradas** de `assets/brand/source/mascote-vetorizado.svg` por `pnpm brand:build` (o fundo é refeito com degradê dos tokens; dentinhos soltos etc. são removidos por prefixo de `d`). Se o vetor mudar, o script falha avisando.
- Ícones: **Phosphor** (`@phosphor-icons/react` no web, `phosphor-react-native` no mobile). Use os nomes de `ui/icon.tsx` (`<Button icone="play">`); botões sempre com ícone + texto.
- Animação: **GSAP** só via `apps/web/src/lib/motion.ts` (`comMovimento`), que desliga tudo com "reduzir movimento". Use `gsap.from` para o conteúdo continuar visível sem animação.

## Mascote (poses e expressões)
Fonte: vetores do Figma em `assets/_source/mascot/raw-*.svg`. `pnpm mascot:build` limpa (remove artefatos/manchas, unifica tons quase iguais, sela frestas, recorta justo), redesenha os olhos de "sério" e "triste" e gera `assets/mascot/*.svg|png` (+ cópia PNG em `apps/mobile/assets/mascote`). Use `<Mascot pose="…" />` / `<MascoteRosto nome="…" />` (web) e `<Mascote />` (mobile). Pose `acenando` usa a arte frontal até existir um aceno. Para trocar a arte: substitua o `raw-N.svg` e rode o script.

## Componentes (shadcn/ui)
`apps/web/src/components/ui/` é shadcn/ui (new-york) adaptado à marca: cores vêm das variáveis semânticas geradas de `tokens.ts` (`bg-primary` etc.), ícones são Phosphor (não use lucide), `Button` aceita `icone="nome"`, tamanho mínimo 48 px. Adicione componentes com `pnpm dlx shadcn@latest add <nome>` e depois troque lucide por Phosphor e `cn` de `@/lib/utils`. Alias `@/` = `apps/web/src`.

## Ilustrações
`pnpm illustrations:build` extrai/adapta dentinhos, brilho e bolhas do vetor (`assets/illustrations/`, servido em `/ilustracoes/*`). Use `<Ilustracao nome="dente-feliz" />`. Dente triste/sujo/brilhando são adaptações novas; a cor `sujeira` é tom de apoio (TODO aprovar).

## Convenções de nome
- TS: arquivos em kebab-case, componentes em PascalCase, `.tsx` só com JSX, hooks `use-*`.
- Mesmo nome, mesma função: `session`, `progress`, `quiz-session` existem nos dois apps; a regra fica no `shared`.
- Rotas do mobile: nome do arquivo = URL, português minúsculo.

## Regras
- **Tema claro apenas.**
- **Sem dados de demonstração em código de produto** (nem na página de marca). Os dados de teste vivem só em `packages/shared/src/mocks/` e são ativados por `VITE_USE_MOCKS`/`EXPO_PUBLIC_USE_MOCKS=true` (dev) via import dinâmico atrás de `__USE_MOCKS__` (web), a CI falha se o bundle de produção contiver o mock. Credenciais demo: professor com código `123456`, turma `DENTE2`.
- **Nenhum dado pessoal de criança** (LGPD art. 14): só apelido + código da turma; sem nome completo, foto, nascimento, localização, contato; sem rastreamento de terceiros nem anúncios. Professor: só nome e e-mail.
- **Acessibilidade:** alvo de toque ≥ 48 px, fonte base grande, respeitar "reduzir movimento", sem sons automáticos, sem limite de tempo no quiz, uma ação por tela, ícone + texto nos botões, narração e legendas nos vídeos, contraste AA.

## Perfis e uso (importante)
O professor conduz a aula pelo **próprio aparelho** (computador, tablet ou celular) e mostra para a turma: os alunos podem não ter celular. Web e app têm os mesmos três perfis:
- **Professor:** conduz módulos (modo sala no web, "Conduzir" no app), vê resultados, gerencia **alunos por apelido** e marca tarefas, e gera o código da família.
- **Criança** (opcional, se houver aparelho): entra com código da turma e apelido.
- **Responsável** (opcional): entra com código de uso único + consentimento e vê **só** tarefas concluídas, dias escovando, sequência, estrelas e última atividade (`Acompanhamento` na API). Nunca respostas individuais, outros alunos ou dados pessoais. Pode encerrar o vínculo a qualquer momento. O teste `mocks.test.ts` trava o formato mínimo desse payload.

## Design system web × mobile
`apps/mobile/src/components/ui` espelha `apps/web/src/components/ui` (mesmos tokens: bordas de 2 px, raios, alturas de 48 px, escala de espaço de 4 px, Nunito/Baloo 2). Para garantir isso:
- `pnpm design:parity` abre `/design-system` no web e no app (react-native-web) e compara os estilos **renderizados**; falha em qualquer divergência.
- `pnpm screens` captura todas as telas do web (desktop e celular) e do app em `docs/screens/`.
- Ambos precisam do web em `WEB_URL` e do app em `MOBILE_URL` (`pnpm --filter @sorriso/mobile exec expo start --web --port 8099`). Para capturar com dados de demonstração, rode o web em modo dev (`vite --port 5199`).
- Se o app web mostrar algo velho depois de editar, reinicie o Metro com `--clear`.

## Texto
Não use travessão (— ou –) em textos do produto. Use vírgula, dois-pontos, parênteses ou ponto. Intervalos escrevem-se "1 a 4".

## Armadilhas conhecidas
- `apps/mobile/app.config.ts` **não pode importar** arquivos `.ts` do workspace (o Expo carrega o config sem transpilar imports); as 2 cores ali espelham `tokens.ts` e o teste `app-config.test.ts` garante a paridade.
- Valide o app com `pnpm --filter @sorriso/mobile exec expo export --platform ios` (e `android`) antes de culpar o dispositivo.
