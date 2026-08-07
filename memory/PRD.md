# Cozinha Lucrativa · Plataforma Elevare

## Problema original (do usuário)
Importar o projeto existente `cozinha200408-main.zip` para o ambiente, extrair,
instalar dependências e deixá-lo pronto para rodar. Sem novas funcionalidades,
correções ou integrações nesta etapa.

## Stack real do projeto (não é o template CRA padrão)
- Frontend: **Next.js 15** (`/app/frontend`) — `app/[[...slug]]/page.js` faz
  lazy-load (ssr:false) do `src/App.js`, que usa React Router v7 no client.
- Backend: **FastAPI** proxy em `:8001` que:
  - Serve nativamente `/api/ai/*` (slogan / product-description / categorize-note
    via emergentintegrations → Claude Sonnet 4.6).
  - Serve nativamente `/api/plantao/*` (base de conhecimento Plantão de Dúvidas).
  - Serve nativamente `/api/payments/*` (Stripe checkout — ver abaixo).
  - Encaminha todo o restante de `/api/*` para o Next.js em `:3000`
    (`app/api/[[...path]]/route.js` implementa as demais rotas com MongoDB).
- Database: **MongoDB** em `mongodb://localhost:27017`, DB `cozinha_lucrativa`.

## Módulos herdados do zip
- Landing page premium com hero de bolo, precificação R$57 à vista.
- Header/Footer com dropdowns Aprender / Vender / Minha Marca.
- Cursos: listagem, detalhe, módulos, player. Jornada gamificada + certificados.
- Calculadora de precificação · Minha Vitrine · Encomendas · Materiais · Bônus.
- Minhas Anotações (widget flutuante) · WhatsApp Scripts.
- Plantão de Dúvidas v2 (backend `plantao_routes.py` + frontend `PlantaoDuvidas`).
- Payment success flow · Documentos legais.

## Setup feito nesta sessão (importação 2026-06)
- ZIP baixado do artifact e extraído.
- Conteúdo copiado para `/app/backend` e `/app/frontend` (removido `craco.config.js`
  legado do template CRA; projeto usa `next.config.js`).
- `/app/backend/.env`: MONGO_URL, DB_NAME=cozinha_lucrativa, CORS_ORIGINS,
  EMERGENT_LLM_KEY (config), STRIPE_SECRET_KEY vazio (sem integração de pagamento
  nesta etapa — boot ignora setup do Stripe com aviso), TEACHER_EMAIL, ADMIN_EMAILS.
- `/app/frontend/.env`: REACT_APP_BACKEND_URL, MONGO_URL, DB_NAME.
- `pip install -r requirements.txt` (fastapi, motor, emergentintegrations, stripe).
- `yarn install` (Next.js 15.5, React 18.3, Radix, framer, mongodb driver).
- Supervisor reiniciado. Frontend/backend/MongoDB rodando.
- Verificado end-to-end: homepage Next.js renderiza hero completo,
  `GET /api/courses` → cursos OK, `GET /api/plantao/meta` → categorias OK.

## Observações
- Stripe: chave real não configurada nesta etapa (premissa: sem integrações).
  `/api/payments/*` responderá indisponível até configurar STRIPE_SECRET_KEY.
- HMR websocket (`/_next/webpack-hmr`) retorna 502 pelo ingress — apenas hot-reload
  de dev, não afeta a aplicação.

## Backlog priorizado (herdado)
- P1: sugestões semânticas por IA no `/api/plantao/suggest`.
- P1: dedupe/rate-limit no `like` da biblioteca de dúvidas públicas.
- P2: notificação por email quando resposta é publicada; filtro "não respondidas".
- P3: reactions extras, tags livres, exportar PDF.

## Como testar localmente
Cookies dev (BETA MODE libera acesso sem login).
