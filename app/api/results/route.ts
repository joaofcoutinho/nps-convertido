import { NextResponse } from "next/server";
import { and, between, desc, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { npsResponses } from "@/lib/db/schema";
import { AREAS } from "@/lib/areas";
import { computeNps } from "@/lib/nps";
import { authorizeAdmin } from "@/lib/auth/admin";
import type {
  AreaAverage,
  BucketFilter,
  PeriodFilter,
  ResponseRow,
  ResultsPayload,
} from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function periodSince(period: PeriodFilter): Date | null {
  if (period === "all") return null;
  const now = new Date();
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

function bucketBounds(bucket: BucketFilter): { min: number; max: number } | null {
  if (bucket === "all") return null;
  if (bucket === "detractors") return { min: 0, max: 2 };
  if (bucket === "passives") return { min: 3, max: 3 };
  return { min: 4, max: 5 };
}

function parsePeriod(v: string | null): PeriodFilter {
  return v === "7d" || v === "30d" || v === "90d" || v === "all" ? v : "all";
}

function parseBucket(v: string | null): BucketFilter {
  return v === "all" || v === "promoters" || v === "passives" || v === "detractors"
    ? v
    : "all";
}

export async function GET(request: Request) {
  const auth = authorizeAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.reason ?? "Não autorizado." },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const period = parsePeriod(url.searchParams.get("period"));
  const bucket = parseBucket(url.searchParams.get("bucket"));
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, Number.parseInt(url.searchParams.get("pageSize") ?? "10", 10) || 10)
  );

  const since = periodSince(period);
  const bounds = bucketBounds(bucket);

  const periodFilter = since ? gte(npsResponses.createdAt, since) : undefined;
  const bucketFilter = bounds
    ? between(npsResponses.scoreNps, bounds.min, bounds.max)
    : undefined;

  const whereClause =
    periodFilter && bucketFilter
      ? and(periodFilter, bucketFilter)
      : periodFilter ?? bucketFilter;

  try {
    /* ---- Agregado: médias por área (período, sem filtro de bucket) ---- */
    // Construção da SELECT como SQL puro para evitar quirks do Drizzle
    // com selections dinâmicas (Record<string, SQL>) sobre AVG/COUNT.
    const colsSql = sql.join(
      AREAS.flatMap((area) => [
        sql.raw(`AVG(score_${area.key})::float AS avg_${area.key}`),
        sql.raw(`COUNT(score_${area.key})::int AS count_${area.key}`),
      ]),
      sql.raw(", ")
    );

    const whereSql = periodFilter ? sql` WHERE created_at >= ${since}` : sql``;
    const rawResult: unknown = await db.execute(
      sql`SELECT COUNT(*)::int AS total, ${colsSql} FROM nps_responses${whereSql}`
    );

    // drizzle-orm/neon-http retorna array direto; outros adapters expõem .rows.
    const aggregateRows: Record<string, number | null>[] = Array.isArray(rawResult)
      ? (rawResult as Record<string, number | null>[])
      : ((rawResult as { rows?: Record<string, number | null>[] }).rows ?? []);

    const aggregate: Record<string, number | null> = aggregateRows[0] ?? {};

    const totalInPeriod = Number(aggregate.total ?? 0);

    const averages: AreaAverage[] = AREAS.map((area) => {
      const avgRaw = aggregate[`avg_${area.key}`];
      const countRaw = aggregate[`count_${area.key}`];
      const avg = avgRaw == null ? 0 : Number(avgRaw);
      const total = countRaw == null ? 0 : Number(countRaw);
      return {
        key: area.key,
        label: area.label,
        average: Number(avg.toFixed(2)),
        total,
      };
    });

    /* ---- NPS final (com base em score_nps) ---- */
    const npsBase = db.select({ score: npsResponses.scoreNps }).from(npsResponses);
    const npsScores = periodFilter ? await npsBase.where(periodFilter) : await npsBase;

    const nps = computeNps(npsScores.map((r) => r.score));

    /* ---- Série temporal: NPS por mês ---- */
    const trendBase = db
      .select({
        bucket: sql<Date | string>`DATE_TRUNC('month', ${npsResponses.createdAt})`,
        total: sql<number>`COUNT(*)::int`,
        promoters: sql<number>`COUNT(*) FILTER (WHERE ${npsResponses.scoreNps} >= 4)::int`,
        detractors: sql<number>`COUNT(*) FILTER (WHERE ${npsResponses.scoreNps} <= 2)::int`,
      })
      .from(npsResponses);

    const trendRows = (await (periodFilter ? trendBase.where(periodFilter) : trendBase)
      .groupBy(sql`DATE_TRUNC('month', ${npsResponses.createdAt})`)
      .orderBy(sql`DATE_TRUNC('month', ${npsResponses.createdAt}) ASC`)) as {
      bucket: Date | string;
      total: number;
      promoters: number;
      detractors: number;
    }[];

    const trend = {
      bucket: "month" as const,
      points: trendRows.map((r) => {
        const total = Number(r.total);
        const promoters = Number(r.promoters);
        const detractors = Number(r.detractors);
        const score = total > 0
          ? Math.round((promoters / total) * 100 - (detractors / total) * 100)
          : 0;
        const dateIso =
          r.bucket instanceof Date ? r.bucket.toISOString() : String(r.bucket);
        return { date: dateIso, nps: score, total };
      }),
    };

    /* ---- Tabela de respostas (com filtros completos) ---- */
    const listCountBase = db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(npsResponses);
    const totalListRows = whereClause
      ? await listCountBase.where(whereClause)
      : await listCountBase;
    const totalList = Number(totalListRows[0]?.total ?? 0);

    const listBase = db
      .select({
        id: npsResponses.id,
        clientName: npsResponses.clientName,
        company: npsResponses.company,
        scoreNps: npsResponses.scoreNps,
        scoreArtes: npsResponses.scoreArtes,
        scoreWebsite: npsResponses.scoreWebsite,
        scoreCrm: npsResponses.scoreCrm,
        scoreCopy: npsResponses.scoreCopy,
        scoreFilmmaker: npsResponses.scoreFilmmaker,
        scorePrazo: npsResponses.scorePrazo,
        scorePlanejamento: npsResponses.scorePlanejamento,
        scoreAtendimento: npsResponses.scoreAtendimento,
        scoreEdicaoVideo: npsResponses.scoreEdicaoVideo,
        comentario: npsResponses.comentario,
        createdAt: npsResponses.createdAt,
      })
      .from(npsResponses);

    const rows = await (whereClause ? listBase.where(whereClause) : listBase)
      .orderBy(desc(npsResponses.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const items: ResponseRow[] = rows.map((r) => ({
      id: r.id,
      clientName: r.clientName,
      company: r.company,
      scoreNps: r.scoreNps,
      scoreArtes: r.scoreArtes,
      scoreWebsite: r.scoreWebsite,
      scoreCrm: r.scoreCrm,
      scoreCopy: r.scoreCopy,
      scoreFilmmaker: r.scoreFilmmaker,
      scorePrazo: r.scorePrazo,
      scorePlanejamento: r.scorePlanejamento,
      scoreAtendimento: r.scoreAtendimento,
      scoreEdicaoVideo: r.scoreEdicaoVideo,
      comentario: r.comentario,
      createdAt:
        r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    }));

    const payload: ResultsPayload = {
      generatedAt: new Date().toISOString(),
      totalResponses: totalInPeriod,
      averages,
      nps,
      trend,
      responses: {
        items,
        page,
        pageSize,
        total: totalList,
      },
      filters: { period, bucket },
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("Erro ao buscar resultados:", err);
    return NextResponse.json(
      { error: "Falha ao calcular resultados." },
      { status: 500 }
    );
  }
}

