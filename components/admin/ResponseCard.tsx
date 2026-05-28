"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { classifyScore, colorForScore } from "@/lib/nps";
import { AREAS } from "@/lib/areas";
import type { ResponseRow } from "@/types";

interface ResponseCardProps {
  row: ResponseRow;
  index: number;
  onDelete?: (id: number) => Promise<void> | void;
}

// Áreas que aparecem no detalhe (exclui NPS — já é o score principal do header do card)
const DETAIL_AREAS = AREAS.filter((a) => a.key !== "nps");

function formatRelative(iso: string): string {
  try {
    const t = new Date(iso).getTime();
    const diff = Date.now() - t;
    const min = Math.floor(diff / 60_000);
    if (min < 1) return "agora";
    if (min < 60) return `há ${min} min`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `há ${hr}h`;
    const days = Math.floor(hr / 24);
    if (days < 7) return `há ${days}d`;
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function badgeFor(score: number) {
  const c = classifyScore(score);
  if (c === "promoter") return { label: "Promotor", color: "#7BD389", bg: "rgba(47,107,58,0.18)" };
  if (c === "passive") return { label: "Neutro", color: "#F2C14E", bg: "rgba(168,132,22,0.18)" };
  return { label: "Detrator", color: "#FF6F61", bg: "rgba(122,31,14,0.20)" };
}

export function ResponseCard({ row, index, onDelete }: ResponseCardProps) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete(row.id);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  const scoreByKey: Record<string, number | null> = {
    artes: row.scoreArtes,
    website: row.scoreWebsite,
    crm: row.scoreCrm,
    copy: row.scoreCopy,
    filmmaker: row.scoreFilmmaker,
    prazo: row.scorePrazo,
    planejamento: row.scorePlanejamento,
    atendimento: row.scoreAtendimento,
    edicao_video: row.scoreEdicaoVideo,
  };

  const badge = badgeFor(row.scoreNps);
  const npsColor = colorForScore(row.scoreNps);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, scale: 0.97 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.2, 0.8, 0.2, 1] }}
      className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 sm:px-6 py-5 hover:bg-white/[0.015] transition-colors flex items-center gap-4"
        aria-expanded={open}
      >
        {/* Score circle */}
        <span
          className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full font-sans text-2xl font-semibold tabular-nums"
          style={{ backgroundColor: `${npsColor}22`, color: npsColor, border: `1px solid ${npsColor}55` }}
        >
          {row.scoreNps}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-sans text-base font-semibold text-brand-light truncate">
              {row.clientName}
            </span>
            <span
              className="font-sans text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: badge.bg, color: badge.color }}
            >
              {badge.label}
            </span>
          </div>
          <div className="mt-1 font-sans text-xs text-brand-muted">
            {row.company ?? "Sem empresa informada"} · {formatRelative(row.createdAt)}
          </div>
        </div>

        <Chevron open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-brand-border">
              <div className="mt-5">
                <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-brand-muted">
                  Notas por área
                </span>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {DETAIL_AREAS.map((area) => (
                    <AreaRow
                      key={area.key}
                      label={area.label}
                      score={scoreByKey[area.key] ?? null}
                    />
                  ))}
                </div>
              </div>

              {row.comentario && (
                <div className="mt-7 pt-5 border-t border-brand-border">
                  <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-brand-muted">
                    Comentário
                  </span>
                  <p className="mt-3 font-sans italic text-sm text-brand-light/90 leading-relaxed">
                    &ldquo;{row.comentario}&rdquo;
                  </p>
                </div>
              )}

              <div className="mt-7 pt-5 border-t border-brand-border flex flex-wrap items-center gap-x-6 gap-y-3 justify-between">
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                  <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-brand-muted">
                    Registro #{row.id}
                  </span>
                  <span className="font-sans text-xs text-brand-muted">
                    {new Date(row.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
                {onDelete && (
                  <AnimatePresence mode="wait" initial={false}>
                    {!confirming ? (
                      <motion.button
                        key="trigger"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirming(true);
                        }}
                        className="inline-flex items-center gap-1.5 font-sans text-xs text-brand-muted hover:text-[#FF6F61] transition-colors"
                      >
                        <TrashIcon />
                        Excluir resposta
                      </motion.button>
                    ) : (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 6 }}
                        transition={{ duration: 0.18 }}
                        className="flex items-center gap-3"
                      >
                        <span className="font-sans text-xs text-brand-light/90">
                          Excluir esta resposta?
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleDelete();
                          }}
                          disabled={deleting}
                          className="px-3 py-1 rounded-full font-sans text-xs uppercase tracking-[0.18em] bg-[#7A1F0E]/30 text-[#FF6F61] hover:bg-[#7A1F0E]/50 transition-colors disabled:opacity-40"
                        >
                          {deleting ? "Excluindo…" : "Sim, excluir"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirming(false);
                          }}
                          disabled={deleting}
                          className="font-sans text-xs text-brand-muted hover:text-brand-light transition-colors disabled:opacity-40"
                        >
                          Cancelar
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function AreaRow({ label, score }: { label: string; score: number | null }) {
  const filled = score == null ? 0 : score;
  const color = colorForScore(score);

  return (
    <div className="flex items-center gap-3">
      <span className="font-sans text-xs text-brand-light/85 flex-1 min-w-0 truncate">
        {label}
      </span>
      <Dots score={filled} color={color} hasData={score != null} />
      <span
        className="font-sans text-sm font-semibold tabular-nums w-6 text-right"
        style={{ color: score == null ? "#6B5A82" : color }}
      >
        {score == null ? "—" : score}
      </span>
    </div>
  );
}

function Dots({ score, color, hasData }: { score: number; color: string; hasData: boolean }) {
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const on = hasData && n <= score;
        return (
          <span
            key={n}
            className="w-1.5 h-1.5 rounded-full transition-colors"
            style={{ backgroundColor: on ? color : "#241239" }}
          />
        );
      })}
    </span>
  );
}

function TrashIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.25 }}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 text-brand-muted"
    >
      <path d="m6 9 6 6 6-6" />
    </motion.svg>
  );
}
