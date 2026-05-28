import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { npsResponses } from "@/lib/db/schema";
import { authorizeAdmin } from "@/lib/auth/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorizeAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.reason ?? "Não autorizado." },
      { status: 401 }
    );
  }

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const deleted = await db
      .delete(npsResponses)
      .where(eq(npsResponses.id, id))
      .returning({ id: npsResponses.id });

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Resposta não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: deleted[0]?.id }, { status: 200 });
  } catch (err) {
    console.error("Erro ao excluir resposta:", err);
    return NextResponse.json(
      { error: "Não foi possível excluir a resposta." },
      { status: 500 }
    );
  }
}
