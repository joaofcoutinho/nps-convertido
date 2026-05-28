"use client";

import type { BucketFilter, PeriodFilter } from "@/types";

interface FiltersProps {
  period: PeriodFilter;
  bucket: BucketFilter;
  onChange: (next: { period: PeriodFilter; bucket: BucketFilter }) => void;
  /** Mostrar o grupo de faixa de NPS (só faz sentido em telas com lista de respostas). */
  showBucket?: boolean;
}

const PERIODS: { value: PeriodFilter; label: string }[] = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "all", label: "Tudo" },
];

const BUCKETS: { value: BucketFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "detractors", label: "Detratores" },
  { value: "passives", label: "Neutros" },
  { value: "promoters", label: "Promotores" },
];

export function Filters({ period, bucket, onChange, showBucket = false }: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
      <FilterGroup
        label="Período"
        options={PERIODS}
        value={period}
        onSelect={(v) => onChange({ period: v, bucket })}
      />
      {showBucket && (
        <FilterGroup
          label="NPS"
          options={BUCKETS}
          value={bucket}
          onSelect={(v) => onChange({ period, bucket: v })}
        />
      )}
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-muted">
        {label}
      </span>
      <div className="flex items-center bg-brand-surface border border-brand-border rounded-full p-1">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onSelect(o.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-sans transition-colors ${
                active
                  ? "bg-brand-primary text-white"
                  : "text-brand-muted hover:text-brand-light"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
