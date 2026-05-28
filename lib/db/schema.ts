import { pgTable, serial, varchar, integer, text, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const npsResponses = pgTable(
  "nps_responses",
  {
    id: serial("id").primaryKey(),
    clientName: varchar("client_name", { length: 255 }).notNull(),
    company: varchar("company", { length: 255 }),
    scoreArtes: integer("score_artes"),
    scoreWebsite: integer("score_website"),
    scoreCrm: integer("score_crm"),
    scoreCopy: integer("score_copy"),
    scoreFilmmaker: integer("score_filmmaker"),
    scorePrazo: integer("score_prazo"),
    scorePlanejamento: integer("score_planejamento"),
    scoreAtendimento: integer("score_atendimento"),
    scoreEdicaoVideo: integer("score_edicao_video"),
    scoreNps: integer("score_nps").notNull(),
    comentario: text("comentario"),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    artesRange: check("score_artes_range", sql`${table.scoreArtes} IS NULL OR ${table.scoreArtes} BETWEEN 0 AND 5`),
    websiteRange: check("score_website_range", sql`${table.scoreWebsite} IS NULL OR ${table.scoreWebsite} BETWEEN 0 AND 5`),
    crmRange: check("score_crm_range", sql`${table.scoreCrm} IS NULL OR ${table.scoreCrm} BETWEEN 0 AND 5`),
    copyRange: check("score_copy_range", sql`${table.scoreCopy} IS NULL OR ${table.scoreCopy} BETWEEN 0 AND 5`),
    filmmakerRange: check("score_filmmaker_range", sql`${table.scoreFilmmaker} IS NULL OR ${table.scoreFilmmaker} BETWEEN 0 AND 5`),
    prazoRange: check("score_prazo_range", sql`${table.scorePrazo} IS NULL OR ${table.scorePrazo} BETWEEN 0 AND 5`),
    planejamentoRange: check("score_planejamento_range", sql`${table.scorePlanejamento} IS NULL OR ${table.scorePlanejamento} BETWEEN 0 AND 5`),
    atendimentoRange: check("score_atendimento_range", sql`${table.scoreAtendimento} IS NULL OR ${table.scoreAtendimento} BETWEEN 0 AND 5`),
    edicaoVideoRange: check("score_edicao_video_range", sql`${table.scoreEdicaoVideo} IS NULL OR ${table.scoreEdicaoVideo} BETWEEN 0 AND 5`),
    npsRange: check("score_nps_range", sql`${table.scoreNps} BETWEEN 0 AND 5`),
  })
);

export type NpsResponse = typeof npsResponses.$inferSelect;
export type NewNpsResponse = typeof npsResponses.$inferInsert;
