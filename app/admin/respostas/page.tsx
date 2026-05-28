"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ResponseCard } from "@/components/admin/ResponseCard";
import { Filters } from "@/components/admin/Filters";
import { useAdminAuth } from "../auth";
import type {
  BucketFilter,
  PeriodFilter,
  ResultsPayload,
} from "@/types";

export default function RespostasPage() {
  const { token, logout } = useAdminAuth();

  const [data, setData] = useState<ResultsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [period, setPeriod] = useState<PeriodFilter>("all");
  const [bucket, setBucket] = useState<BucketFilter>("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        period,
        bucket,
        page: String(page),
        pageSize: "20",
      });
      const res = await fetch(`/api/results?${params}`, {
        headers: { Authorization: `Basic ${token}` },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error("Falha ao carregar respostas.");
      setData((await res.json()) as ResultsPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }, [token, period, bucket, page, logout]);

  useEffect(() => {
    void fetchResults();
  }, [fetchResults]);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        const res = await fetch(`/api/responses/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Basic ${token}` },
        });
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Falha ao excluir.");
        }
        setToast("Resposta excluída.");
        window.setTimeout(() => setToast(null), 2400);

        // Otimista: remove da lista atual e decrementa total
        setData((prev) =>
          prev
            ? {
                ...prev,
                totalResponses: Math.max(0, prev.totalResponses - 1),
                responses: {
                  ...prev.responses,
                  items: prev.responses.items.filter((r) => r.id !== id),
                  total: Math.max(0, prev.responses.total - 1),
                },
              }
            : prev
        );

        // E refaz a busca para reidratar agregados/paginação
        void fetchResults();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao excluir.");
        window.setTimeout(() => setError(null), 3500);
      }
    },
    [token, logout, fetchResults]
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data.responses.items;
    return data.responses.items.filter((r) => {
      return (
        r.clientName.toLowerCase().includes(q) ||
        (r.company?.toLowerCase().includes(q) ?? false) ||
        (r.comentario?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [data, search]);

  const totalPages = data
    ? Math.max(1, Math.ceil(data.responses.total / data.responses.pageSize))
    : 1;

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-brand-surface border border-brand-border shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)]"
          >
            <span className="font-sans text-sm text-brand-light">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    <section className="px-6 sm:px-10 lg:px-16 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div>
            <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-brand-muted">
              Painel
            </span>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl tracking-tight-display">
              Respostas dos
              <span
                className="italic ml-3"
                style={{ color: "var(--color-brand-primary)" }}
              >
                clientes
              </span>
            </h1>
            <p className="mt-2 font-sans text-xs text-brand-muted">
              {data
                ? `${data.responses.total} ${
                    data.responses.total === 1 ? "registro" : "registros"
                  } no filtro atual`
                : "Carregando..."}
            </p>
          </div>

          <Filters
            period={period}
            bucket={bucket}
            showBucket
            onChange={({ period: p, bucket: b }) => {
              setPeriod(p);
              setBucket(b);
              setPage(1);
            }}
          />
        </div>

        {/* Busca local sobre a página atual */}
        <div className="mb-6">
          <div className="relative">
            <SearchIcon />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente, empresa ou comentário…"
              className="w-full bg-brand-surface border border-brand-border rounded-lg py-3 pl-11 pr-4 font-sans text-sm text-brand-light placeholder:text-brand-muted/70 focus:border-brand-primary outline-none transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[#7A1F0E]/20 border border-[#7A1F0E]/40 text-[#FF6F61] font-sans text-sm">
            {error}
          </div>
        )}

        {loading && !data && (
          <div className="py-24 text-center font-sans text-sm text-brand-muted">
            Carregando respostas...
          </div>
        )}

        {data && data.responses.items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-brand-muted">
              Sem registros
            </span>
            <h2 className="mt-3 font-sans text-xl font-semibold tracking-tight-display">
              Nada no filtro atual
            </h2>
            <p className="mt-2 font-sans text-sm text-brand-muted max-w-md mx-auto">
              Ajuste período ou faixa de NPS para visualizar mais respostas.
            </p>
          </motion.div>
        )}

        {data && data.responses.items.length > 0 && (
          <ul className="space-y-3">
            {filtered.length === 0 ? (
              <li className="py-12 text-center font-sans text-sm text-brand-muted">
                Nenhum resultado para &ldquo;{search}&rdquo;.
              </li>
            ) : (
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.map((r, i) => (
                  <ResponseCard
                    key={r.id}
                    row={r}
                    index={i}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            )}
          </ul>
        )}

        {data && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <span className="font-sans text-xs text-brand-muted">
              Página {data.responses.page} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-md text-xs font-sans border border-brand-border text-brand-light disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-muted"
              >
                ← Anterior
              </button>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-md text-xs font-sans border border-brand-border text-brand-light disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-muted"
              >
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
