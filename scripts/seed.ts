/**
 * Local seed — gera respostas fictícias para validar o painel admin.
 * Uso: `npm run db:seed`
 *
 * Lê DATABASE_URL de .env.local (ou do ambiente).
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { npsResponses } from "../lib/db/schema";

loadLocalEnv();

const SAMPLE_NAMES = [
  "Joana Lima",
  "Pedro Henrique",
  "Marina Souza",
  "Lucas Andrade",
  "Camila Ribeiro",
  "Rafael Mendes",
  "Tatiane Oliveira",
  "Bruno Carvalho",
  "Letícia Rocha",
  "Felipe Nascimento",
  "Ana Beatriz",
  "Diego Martins",
];

const SAMPLE_COMPANIES: (string | null)[] = [
  "Atelier Lima",
  "Studio Nordeste",
  "Verdejar",
  "Concorde Imóveis",
  "Marina Café",
  null,
  "Garagem 12",
  "Bem Saúde",
  null,
  "Lume Joias",
  "Casa Modular",
  null,
];

const COMMENTS: (string | null)[] = [
  "O time atendeu além das expectativas no último trimestre.",
  "Gostei dos prazos, mas algumas peças precisaram de mais revisões.",
  "A direção dos vídeos foi o destaque para a gente.",
  "Sugiro mais reuniões de planejamento de longo prazo.",
  null,
  "Atendimento sempre próximo, isso faz diferença pra gente.",
  null,
  "Copy ficou afiada, performance subiu na semana seguinte.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

// Escala 0-5: high tende a 4-5, mid a 3-4, low a 0-2
function score(bias: "high" | "mid" | "low"): number {
  if (bias === "high") return 4 + Math.floor(Math.random() * 2); // 4..5
  if (bias === "mid") return 3 + Math.floor(Math.random() * 2);  // 3..4
  return Math.floor(Math.random() * 3); // 0..2
}

function randomDaysAgo(maxDays: number): Date {
  const days = Math.random() * maxDays;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

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

  const db = drizzle(neon(url));

  const rows = Array.from({ length: 24 }, () => {
    const bias = (["high", "high", "high", "mid", "mid", "low"] as const)[
      Math.floor(Math.random() * 6)
    ]!;
    return {
      clientName: pick(SAMPLE_NAMES),
      company: pick(SAMPLE_COMPANIES),
      scoreArtes: score(bias),
      scoreWebsite: score(bias),
      scoreCrm: score(bias),
      scoreCopy: score(bias),
      scoreFilmmaker: score(bias),
      scorePrazo: score(bias === "high" ? "mid" : bias),
      scorePlanejamento: score(bias),
      scoreAtendimento: score(bias === "low" ? "mid" : bias),
      scoreEdicaoVideo: score(bias),
      scoreNps: score(bias),
      comentario: pick(COMMENTS),
      createdAt: randomDaysAgo(90),
    };
  });

  await db.insert(npsResponses).values(rows);
  console.log(`Inseridas ${rows.length} respostas fictícias.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
