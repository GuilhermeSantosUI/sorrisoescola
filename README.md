# Sorriso na Escola

Plataforma educativa de saúde bucal (UNIT × Nossa Escola, Aracaju/SE). O **professor** conduz a aula pelo próprio
aparelho (computador, tablet ou celular) e mostra para a turma; crianças e famílias participam de forma opcional.
pt-BR, só tema claro, sem dados pessoais de crianças (LGPD, art. 14).

## Como rodar cada versão

Na raiz: `pnpm install` (uma vez). Em desenvolvimento os **dados de demonstração** já vêm ligados, então não é preciso API.

| Versão | Comando | Onde abre |
|---|---|---|
| **Web** (computador, tablet, celular pelo navegador) | `pnpm dev:web` | http://localhost:5173 |
| **App no navegador** (pré-visualização do mobile) | `pnpm dev:mobile:web` | http://localhost:8099 |
| **App no celular** (Expo Go ou build de desenvolvimento) | `pnpm dev:mobile` e leia o QR code | seu aparelho, na mesma rede Wi-Fi |
| **App no simulador iOS** (precisa do Xcode) | `pnpm dev:mobile:ios` | simulador |
| **App no emulador Android** (precisa do Android Studio) | `pnpm dev:mobile:android` | emulador |

Dicas:
- Teste primeiro no navegador (`dev:web` e `dev:mobile:web`); é o caminho mais rápido.
- No celular, tente o **Expo Go**. Se aparecer erro de módulo nativo (por exemplo, abas com liquid glass do iOS 26), use `dev:mobile:ios` ou `dev:mobile:android`, que geram um build de desenvolvimento.
- Se o app web mostrar algo antigo depois de editar, pare e rode `pnpm --filter @sorriso/mobile exec expo start --web --clear`.

### Ambientes
- Web: `.env.development` (dev, com demonstração), `.env.staging` (`pnpm --filter @sorriso/web dev:hml`), `.env.production` (`pnpm build:web`).
- App: `apps/mobile/.env` (dev) e perfis `development`, `preview` e `production` no `eas.json` (`eas build --profile preview`).
- Copie `.env.example` de cada app e preencha `*_API_URL`. Nenhum segredo vai para o repositório.

## Entrar com os dados de demonstração
| Perfil | Como |
|---|---|
| Professor | qualquer e-mail e código **123456** |
| Criança (app) | turma **DENTE2** e um apelido |
| Responsável | código **PAPA23** e marcar o consentimento |

## Verificações
`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm theme:check`, `pnpm design:parity` (web × app) e `pnpm screens` (captura de telas em `docs/screens/`).
Mais detalhes de arquitetura, fluxos e regras em [AGENTS.md](AGENTS.md).
