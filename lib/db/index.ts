import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL não está definida. Configure a variável de ambiente apontando para o Neon."
  );
}

// Next.js 14 cacheia chamadas fetch() server-side por padrão. O cliente HTTP do
// Neon usa fetch internamente — sem isso, queries idênticas retornavam dados
// frozen do primeiro hit. Forçamos no-store em todas as chamadas.
const sql = neon(databaseUrl, {
  fetchOptions: { cache: "no-store" },
});

export const db = drizzle(sql, { schema });
export { schema };
