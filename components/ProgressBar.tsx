"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-xs font-sans uppercase tracking-[0.18em] text-brand-muted">
        <span>Passo {current} de {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="relative h-[2px] w-full bg-brand-border overflow-hidden rounded-full">
        <motion.div
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 24 }}
          className="absolute top-0 left-0 h-full"
          style={{ backgroundColor: "var(--color-brand-primary)" }}
        />
      </div>
    </div>
  );
}
