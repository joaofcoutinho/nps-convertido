"use client";

import { motion } from "framer-motion";
import type { NpsBreakdown } from "@/types";

interface NpsHeroProps {
  data: NpsBreakdown;
}

const zoneAccent: Record<NpsBreakdown["zone"], string> = {
  critical: "#FF6F61",
  improvement: "#F2C14E",
  quality: "#B987E6",
  excellence: "#7BD389",
};

export function NpsHero({ data }: NpsHeroProps) {
  const accent = zoneAccent[data.zone];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative bg-brand-surface border border-brand-border rounded-xl p-8 sm:p-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-8 h-[1px]"
              style={{ backgroundColor: accent }}
            />
            <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-brand-muted">
              NPS Score
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-4">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-sans text-[7rem] sm:text-[9rem] leading-none font-semibold tabular-nums tracking-tight-display"
              style={{ color: accent }}
            >
              {data.score}
            </motion.span>
            <span className="font-sans text-brand-muted text-sm">/ 100</span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span
              className="font-sans text-xl font-medium"
              style={{ color: accent }}
            >
              {data.zoneLabel}
            </span>
            <span className="font-sans text-xs text-brand-muted">
              · {data.total} {data.total === 1 ? "resposta" : "respostas"}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 lg:border-l lg:border-brand-border lg:pl-10">
          <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-brand-muted">
            Distribuição
          </span>
          <div className="mt-5 space-y-4">
            <Row
              label="Promotores"
              count={data.promoters}
              pct={data.promoterPct}
              color="#7BD389"
              bar="#2F6B3A"
            />
            <Row
              label="Neutros"
              count={data.passives}
              pct={data.passivePct}
              color="#F2C14E"
              bar="#A88416"
            />
            <Row
              label="Detratores"
              count={data.detractors}
              pct={data.detractorPct}
              color="#FF6F61"
              bar="#7A1F0E"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Row({
  label,
  count,
  pct,
  color,
  bar,
}: {
  label: string;
  count: number;
  pct: number;
  color: string;
  bar: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-sans text-xs uppercase tracking-[0.16em] text-brand-light/90">
          {label}
        </span>
        <span className="flex items-baseline gap-2">
          <span
            className="font-sans text-xl font-semibold tabular-nums"
            style={{ color }}
          >
            {pct.toFixed(0)}%
          </span>
          <span className="font-sans text-xs text-brand-muted tabular-nums">
            {count}
          </span>
        </span>
      </div>
      <div className="h-[3px] w-full rounded-full bg-brand-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: bar }}
        />
      </div>
    </div>
  );
}
