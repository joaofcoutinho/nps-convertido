"use client";

import { motion } from "framer-motion";

interface StatPercentProps {
  label: string;
  percent: number;
  count: number;
  accent: string;
  delay?: number;
}

export function StatPercent({ label, percent, count, accent, delay = 0 }: StatPercentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative bg-brand-surface border border-brand-border rounded-xl p-6 overflow-hidden"
    >
      <div className="flex items-baseline justify-between mb-6">
        <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-brand-muted">
          {label}
        </span>
        <span className="font-sans text-xs text-brand-muted tabular-nums">
          {count}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="font-sans text-5xl font-semibold tabular-nums tracking-tight-display"
          style={{ color: accent }}
        >
          {percent.toFixed(0)}
        </span>
        <span className="font-sans text-base text-brand-muted">%</span>
      </div>
      <div className="mt-5 h-[2px] w-full bg-brand-border overflow-hidden rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, percent)}%` }}
          transition={{ duration: 0.8, delay: delay + 0.15 }}
          className="h-full"
          style={{ backgroundColor: accent }}
        />
      </div>
    </motion.div>
  );
}
