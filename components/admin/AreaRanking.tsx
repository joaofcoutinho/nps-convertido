"use client";

import { motion } from "framer-motion";
import { colorForScore } from "@/lib/nps";
import type { AreaAverage } from "@/types";

interface AreaRankingProps {
  areas: AreaAverage[];
}

export function AreaRanking({ areas }: AreaRankingProps) {
  const sorted = [...areas].sort((a, b) => b.average - a.average);

  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8">
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="font-sans text-sm font-medium uppercase tracking-[0.18em] text-brand-light">
          Ranking de áreas
        </h3>
        <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-brand-muted">
          maior para o menor
        </span>
      </div>

      <ul className="divide-y divide-brand-border">
        {sorted.map((a, i) => {
          const hasData = a.total > 0;
          const pct = hasData ? (a.average / 5) * 100 : 0;
          const color = colorForScore(hasData ? a.average : null);

          return (
            <motion.li
              key={a.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="font-sans text-xs tabular-nums text-brand-muted w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-sm text-brand-light truncate">
                    {a.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 flex-shrink-0">
                  <span className="font-sans text-lg font-semibold tabular-nums text-brand-light">
                    {hasData ? a.average.toFixed(1) : "—"}
                  </span>
                  <span className="font-sans text-[10px] text-brand-muted">/ 5</span>
                  <span className="font-sans text-[10px] text-brand-muted ml-3 tabular-nums">
                    {a.total} resp.
                  </span>
                </div>
              </div>
              <div className="relative h-1 w-full rounded-full bg-brand-border overflow-hidden ml-8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
