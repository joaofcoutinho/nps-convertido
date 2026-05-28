/**
 * Valida o cabeçalho Authorization (HTTP Basic) contra ADMIN_EMAIL / ADMIN_PASSWORD.
 * Compartilhado por todas as rotas do painel admin.
 */
export function authorizeAdmin(request: Request): { ok: boolean; reason?: string } {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return { ok: false, reason: "Servidor sem credenciais configuradas." };
  }

  const auth = request.headers.get("authorization") ?? "";
  if (!auth.startsWith("Basic ")) return { ok: false };

  try {
    const decoded = Buffer.from(auth.slice(6).trim(), "base64").toString("utf8");
    const idx = decoded.indexOf(":");
    if (idx === -1) return { ok: false };
    const email = decoded.slice(0, idx).trim().toLowerCase();
    const password = decoded.slice(idx + 1);
    if (email === expectedEmail.toLowerCase() && password === expectedPassword) {
      return { ok: true };
    }
  } catch {
    return { ok: false };
  }

  return { ok: false };
}
