import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL não está definida. Configure a variável de ambiente apontando para o Neon."
  );
}

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
export { schema };
