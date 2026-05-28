import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { db } from "@/lib/db";
import { npsResponses } from "@/lib/db/schema";
import { npsSubmissionSchema } from "@/lib/validations/nps";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  let parsed;
  try {
    parsed = npsSubmissionSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.errors[0];
      return NextResponse.json(
        { error: first?.message ?? "Dados inválidos.", issues: err.errors },
        { status: 422 }
      );
    }
    return NextResponse.json({ error: "Dados inválidos." }, { status: 422 });
  }

  try {
    const inserted = await db
      .insert(npsResponses)
      .values({
        clientName: parsed.client_name,
        company: parsed.company ?? null,
        scoreArtes: parsed.score_artes ?? null,
        scoreWebsite: parsed.score_website ?? null,
        scoreCrm: parsed.score_crm ?? null,
        scoreCopy: parsed.score_copy ?? null,
        scoreFilmmaker: parsed.score_filmmaker ?? null,
        scorePrazo: parsed.score_prazo ?? null,
        scorePlanejamento: parsed.score_planejamento ?? null,
        scoreAtendimento: parsed.score_atendimento ?? null,
        scoreEdicaoVideo: parsed.score_edicao_video ?? null,
        scoreNps: parsed.score_nps,
        comentario: parsed.comentario ?? null,
      })
      .returning({ id: npsResponses.id });

    return NextResponse.json({ success: true, id: inserted[0]?.id }, { status: 201 });
  } catch (err) {
    console.error("Erro ao salvar NPS:", err);
    return NextResponse.json(
      { error: "Não foi possível registrar sua avaliação." },
      { status: 500 }
    );
  }
}
