# NPS — Convertido Marketing

Aplicação web de NPS (Net Promoter Score) da [Convertido](https://convertido.com.br). Coleta avaliação dos clientes por área de serviço, persiste no Neon (PostgreSQL) e exibe um painel interno de resultados.

- **Stack**: Next.js 14 (App Router) · TypeScript · Drizzle ORM · Neon · Tailwind · Framer Motion · Zod
- **Visual**: dark theme editorial · Playfair Display + DM Sans · paleta roxa (`#A264D8` sobre `#0A0118`) da Convertido

---

## Setup local

### 1. Pré-requisitos

- Node.js 18.18+ (recomendado 20+)
- Conta Neon com uma database criada — copie a connection string com `?sslmode=require`

### 2. Instalação

```bash
npm install
```

### 3. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
DATABASE_URL=postgres://user:pass@ep-xxxx.neon.tech/dbname?sslmode=require
ADMIN_PASSWORD=defina-uma-senha-forte
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | sim | Connection string do Neon (PostgreSQL). |
| `ADMIN_PASSWORD` | sim | Senha do painel `/admin`. |
| `NEXT_PUBLIC_SITE_URL` | não | URL pública do site (usada em `og:url`). |

### 4. Criar a tabela no Neon

Duas opções equivalentes:

```bash
# Opção A — Drizzle Kit (sincroniza o schema TS com o banco)
npm run db:push

# Opção B — SQL direto (idempotente)
npm run db:migrate
```

### 5. (Opcional) Popular dados de teste

```bash
npm run db:seed
```

Insere ~24 respostas fictícias com datas distribuídas nos últimos 90 dias.

### 6. Rodar a aplicação

```bash
npm run dev
```

Acesse:

- `http://localhost:3000` — landing da pesquisa
- `http://localhost:3000/pesquisa` — formulário multi-step
- `http://localhost:3000/obrigado` — confirmação
- `http://localhost:3000/admin` — painel (use a `ADMIN_PASSWORD`)

---

## Estrutura

```
app/
  api/
    submit-nps/route.ts    # POST — recebe avaliação
    results/route.ts       # GET  — dados do painel (Bearer ADMIN_PASSWORD)
  admin/                   # /admin — login + dashboard
  pesquisa/                # /pesquisa — formulário multi-step
  obrigado/                # /obrigado — tela de confirmação
  page.tsx                 # landing
  layout.tsx               # fontes + metadados globais
  globals.css              # tokens + Tailwind base

components/
  ScoreSelector.tsx        # botões 0–5 com cor por faixa
  ProgressBar.tsx
  Button.tsx
  Logo.tsx
  AnimatedCheck.tsx        # checkmark SVG animado
  admin/
    AreaCard.tsx
    NpsHero.tsx
    ResponsesTable.tsx
    Filters.tsx

lib/
  db/                      # cliente Neon + schema Drizzle
  validations/nps.ts       # schema Zod do POST
  areas.ts                 # definição das áreas e perguntas
  nps.ts                   # cálculo de NPS + zonas

types/index.ts             # tipos compartilhados (AreaAverage, ResultsPayload…)
scripts/
  migrate.ts               # cria a tabela via SQL puro
  seed.ts                  # popula dados fictícios
```

---

## API

### `POST /api/submit-nps`

Body JSON (validado por Zod):

```jsonc
{
  "client_name": "Joana Lima",          // obrigatório
  "company": "Atelier Lima",             // opcional
  "score_artes": 5,                      // opcional, 0–5
  "score_website": 4,
  "score_crm": 4,
  "score_copy": 5,
  "score_filmmaker": 5,
  "score_prazo": 4,
  "score_planejamento": 4,
  "score_atendimento": 5,
  "score_edicao_video": 5,
  "score_nps": 5,                        // obrigatório
  "comentario": "Atendimento impecável." // opcional
}
```

Resposta:

```jsonc
{ "success": true, "id": 42 }
```

### `GET /api/results`

Header obrigatório: `Authorization: Bearer <ADMIN_PASSWORD>`

Query params:

- `period` — `7d` | `30d` | `90d` | `all` (default `all`)
- `bucket` — `all` | `promoters` | `passives` | `detractors` (default `all`)
- `page` — número da página da tabela (default `1`)
- `pageSize` — itens por página (default `10`, máximo `50`)

Retorna o payload `ResultsPayload` definido em [types/index.ts](types/index.ts).

---

## Cálculo de NPS

Escala adaptada **0–5** (em vez do 0–10 tradicional):

```
% Promotores  = respostas com score 4 ou 5
% Neutros     = respostas com score 3
% Detratores  = respostas com score 0, 1 ou 2

NPS = arredondar(% Promotores − % Detratores)
```

Zonas exibidas no painel:

| Faixa | Rótulo |
|---|---|
| < 0 | Zona Crítica |
| 0–49 | Zona de Melhoria |
| 50–74 | Zona de Qualidade |
| 75–100 | Zona de Excelência |

---

## Deploy (Vercel)

1. Faça push do repositório.
2. Importe o projeto na Vercel (framework detectado automaticamente).
3. Configure as variáveis de ambiente em **Project Settings → Environment Variables**:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_SITE_URL`
4. Antes do primeiro deploy, rode `npm run db:migrate` localmente apontando para o Neon de produção (ou execute `db:push`).

---

## Decisões de projeto

- **Sem biblioteca de auth no /admin** — apenas comparação direta entre `Authorization: Bearer` e `ADMIN_PASSWORD`. Suficiente para painel interno; a senha nunca é enviada ao client além do que o usuário digita.
- **Token guardado em `sessionStorage`** — não persiste entre abas/sessões para reduzir risco de exposição.
- **`bucket` não afeta médias e NPS final** — apenas filtra a tabela de respostas. As médias e o NPS continuam refletindo o período inteiro, evitando interpretações enviesadas.
- **Tipografia editorial** — Playfair Display em peso 500 com itálico para acentos, DM Sans com tracking expandido em rótulos uppercase. Sem Inter, sem Roboto.
