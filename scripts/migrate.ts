/**
 * Aplica a migration inicial: cria a tabela `nps_responses` e índices úteis.
 * Idempotente — pode rodar quantas vezes quiser. Para ALTERAR constraints
 * existentes (ex.: trocar BETWEEN 0 AND 10 por 0 AND 5), rode primeiro
 * `npm run db:reset` ou drope a tabela manualmente.
 *
 * Uso: `npm run db:migrate`
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

loadLocalEnv();

function loadLocalEnv() {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL não definida. Configure .env.local ou exporte a variável.");
    process.exit(1);
  }
  const sql = neon(url);

  await sql`
    CREATE TABLE IF NOT EXISTS nps_responses (
      id                  SERIAL PRIMARY KEY,
      client_name         VARCHAR(255) NOT NULL,
      company             VARCHAR(255),
      score_artes         INTEGER CHECK (score_artes IS NULL OR score_artes BETWEEN 0 AND 5),
      score_website       INTEGER CHECK (score_website IS NULL OR score_website BETWEEN 0 AND 5),
      score_crm           INTEGER CHECK (score_crm IS NULL OR score_crm BETWEEN 0 AND 5),
      score_copy          INTEGER CHECK (score_copy IS NULL OR score_copy BETWEEN 0 AND 5),
      score_filmmaker     INTEGER CHECK (score_filmmaker IS NULL OR score_filmmaker BETWEEN 0 AND 5),
      score_prazo         INTEGER CHECK (score_prazo IS NULL OR score_prazo BETWEEN 0 AND 5),
      score_planejamento  INTEGER CHECK (score_planejamento IS NULL OR score_planejamento BETWEEN 0 AND 5),
      score_atendimento   INTEGER CHECK (score_atendimento IS NULL OR score_atendimento BETWEEN 0 AND 5),
      score_edicao_video  INTEGER CHECK (score_edicao_video IS NULL OR score_edicao_video BETWEEN 0 AND 5),
      score_nps           INTEGER NOT NULL CHECK (score_nps BETWEEN 0 AND 5),
      comentario          TEXT,
      created_at          TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS nps_responses_created_at_idx ON nps_responses (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS nps_responses_score_nps_idx ON nps_responses (score_nps)`;

  const [{ count }] = (await sql`SELECT COUNT(*)::int AS count FROM nps_responses`) as {
    count: number;
  }[];
  console.log(`Migration ok. Tabela nps_responses com ${count} respostas.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
