"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AreaRanking } from "@/components/admin/AreaRanking";
import { NpsHero } from "@/components/admin/NpsHero";
import { Filters } from "@/components/admin/Filters";
import { StatPercent } from "@/components/admin/StatPercent";
import { TrendChart } from "@/components/admin/TrendChart";
import { useAdminAuth } from "./auth";
import type { BucketFilter, PeriodFilter, ResultsPayload } from "@/types";

export default function AdminDashboardPage() {
  const { token, logout } = useAdminAuth();
  const [data, setData] = useState<ResultsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [period, setPeriod] = useState<PeriodFilter>("all");
  const [bucket, setBucket] = useState<BucketFilter>("all");

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        period,
        bucket,
        page: "1",
        pageSize: "1",
      });
      const res = await fetch(`/api/results?${params}`, {
        headers: { Authorization: `Basic ${token}` },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) throw new Error("Falha ao carregar resultados.");
      const json = (await res.json()) as ResultsPayload;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }, [token, period, bucket, logout]);

  useEffect(() => {
    void fetchResults();
  }, [fetchResults]);

  const isEmpty = data ? data.totalResponses === 0 : false;

  return (
    <section className="px-6 sm:px-10 lg:px-16 pt-10 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight-display">
              Como estamos
              <span
                className="italic ml-3"
                style={{ color: "var(--color-brand-primary)" }}
              >
                indo
              </span>
            </h1>
            <p className="mt-2 font-sans text-xs text-brand-muted">
              {data
                ? `${data.totalResponses} ${
                    data.totalResponses === 1
                      ? "resposta no período"
                      : "respostas no período"
                  } · atualizado ${new Date(data.generatedAt).toLocaleString("pt-BR")}`
                : "Carregando..."}
            </p>
          </div>

          <Filters
            period={period}
            bucket={bucket}
            onChange={({ period: p, bucket: b }) => {
              setPeriod(p);
              setBucket(b);
            }}
          />
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-lg bg-[#7A1F0E]/20 border border-[#7A1F0E]/40 text-[#FF6F61] font-sans text-sm">
            {error}
          </div>
        )}

        {loading && !data && (
          <div className="py-32 text-center font-sans text-sm text-brand-muted">
            Carregando dados...
          </div>
        )}

        {data && (
          <>
            {isEmpty ? (
              <EmptyState />
            ) : (
              <>
                <section id="nps" className="scroll-mt-32">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <StatPercent
                      label="Promotores"
                      percent={data.nps.promoterPct}
                      count={data.nps.promoters}
                      accent="#7BD389"
                      delay={0}
                    />
                    <StatPercent
                      label="Neutros"
                      percent={data.nps.passivePct}
                      count={data.nps.passives}
                      accent="#F2C14E"
                      delay={0.06}
                    />
                    <StatPercent
                      label="Detratores"
                      percent={data.nps.detractorPct}
                      count={data.nps.detractors}
                      accent="#FF6F61"
                      delay={0.12}
                    />
                  </div>

                  <NpsHero data={data.nps} />
                </section>

                <section id="areas" className="mt-6 scroll-mt-32">
                  <AreaRanking areas={data.averages} />
                </section>

                <section id="evolucao" className="mt-6 scroll-mt-32">
                  <TrendChart points={data.trend.points} />
                </section>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-brand-surface border border-brand-border rounded-xl p-12 sm:p-16 text-center"
    >
      <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-brand-muted">
        Sem respostas ainda
      </span>
      <h2 className="mt-4 font-sans text-2xl font-semibold tracking-tight-display">
        Aguardando a{" "}
        <span style={{ color: "var(--color-brand-primary)" }}>
          primeira avaliação
        </span>
      </h2>
      <p className="mt-4 font-sans text-sm text-brand-muted max-w-md mx-auto">
        Compartilhe o link da pesquisa com seus clientes. Assim que as primeiras
        respostas chegarem, os indicadores aparecem aqui.
      </p>
      <p className="mt-8 font-sans text-xs text-brand-muted">
        Link da pesquisa:{" "}
        <span className="text-brand-light">
          {typeof window !== "undefined" ? window.location.origin : ""}
        </span>
      </p>
    </motion.div>
  );
}
