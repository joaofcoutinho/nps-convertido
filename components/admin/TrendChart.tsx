"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { TrendPoint } from "@/types";

interface TrendChartProps {
  points: TrendPoint[];
}

const W = 1000;
const H = 220;
const PAD_L = 50;
const PAD_R = 28;
const PAD_TOP = 26;
const PAD_BOTTOM = 32;

const Y_MIN = -100;
const Y_MAX = 100;
const Y_TICKS = [-100, -50, 0, 50, 100];

function fmtShort(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  } catch {
    return iso;
  }
}

function fmtLong(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function colorForNps(score: number): string {
  if (score < 0) return "#FF6F61";
  if (score < 50) return "#F2C14E";
  if (score < 75) return "#A264D8";
  return "#7BD389";
}

/** Cubic-bezier smoothed path passando por todos os pontos.
 *  Cada segmento usa control points horizontais simétricos — gera curva natural sem overshoot. */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0]!.x} ${pts[0]!.y}`;

  let d = `M ${pts[0]!.x.toFixed(2)} ${pts[0]!.y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i]!;
    const p1 = pts[i + 1]!;
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX.toFixed(2)} ${p0.y.toFixed(2)}, ${midX.toFixed(2)} ${p1.y.toFixed(2)}, ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  }
  return d;
}

export function TrendChart({ points }: TrendChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const layout = useMemo(() => {
    const innerW = W - PAD_L - PAD_R;
    const innerH = H - PAD_TOP - PAD_BOTTOM;

    const yFor = (nps: number) => {
      const pct = (nps - Y_MIN) / (Y_MAX - Y_MIN);
      return PAD_TOP + (1 - pct) * innerH;
    };

    const marks =
      points.length > 1
        ? points.map((p, i) => ({
            x: PAD_L + (innerW / (points.length - 1)) * i,
            y: yFor(p.nps),
            p,
            i,
          }))
        : points.map((p) => ({
            x: PAD_L + innerW / 2,
            y: yFor(p.nps),
            p,
            i: 0,
          }));

    const line = smoothPath(marks);
    const yZero = yFor(0);
    const yAreaBottom = H - PAD_BOTTOM;

    const area =
      marks.length > 1
        ? `${line} L ${marks[marks.length - 1]!.x.toFixed(2)} ${yAreaBottom} L ${marks[0]!.x.toFixed(2)} ${yAreaBottom} Z`
        : "";

    const last = marks[marks.length - 1];
    const first = marks[0];

    return { innerW, innerH, marks, line, area, yZero, yFor, last, first };
  }, [points]);

  if (points.length === 0) {
    return (
      <Frame title="Evolução do NPS" subtitle="Sem dados no período selecionado.">
        <div className="h-[200px] flex items-center justify-center text-brand-muted font-sans text-sm">
          Quando houver respostas, a tendência aparece aqui.
        </div>
      </Frame>
    );
  }

  const last = layout.last!;
  const lastColor = colorForNps(last.p.nps);

  return (
    <Frame
      title="Evolução do NPS"
      subtitle="Variação semanal do score (escala −100 a +100)"
      meta={
        <div className="flex items-baseline gap-2">
          <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-brand-muted">
            Atual
          </span>
          <span
            className="font-sans text-2xl font-semibold tabular-nums tracking-tight-display"
            style={{ color: lastColor }}
          >
            {last.p.nps}
          </span>
        </div>
      }
    >
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto block"
          style={{ maxHeight: 320 }}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A264D8" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#A264D8" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#A264D8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y-axis grid + labels */}
          {Y_TICKS.map((tick) => {
            const y = layout.yFor(tick);
            const isZero = tick === 0;
            return (
              <g key={tick}>
                <line
                  x1={PAD_L}
                  x2={W - PAD_R}
                  y1={y}
                  y2={y}
                  stroke={isZero ? "#3a1c5a" : "#1e0e30"}
                  strokeWidth={isZero ? 1 : 1}
                  strokeDasharray={isZero ? "none" : "2 5"}
                />
                <text
                  x={PAD_L - 10}
                  y={y + 3}
                  fontSize="10"
                  fill="#6B5A82"
                  fontFamily="var(--font-dm-sans), sans-serif"
                  textAnchor="end"
                  letterSpacing="0.05em"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {tick > 0 ? `+${tick}` : tick}
                </text>
              </g>
            );
          })}

          {/* Vertical helper grid */}
          {layout.marks.map((m, i) => (
            <line
              key={`v-${i}`}
              x1={m.x}
              x2={m.x}
              y1={PAD_TOP}
              y2={H - PAD_BOTTOM}
              stroke={hoverIdx === i ? "#3a1c5a" : "transparent"}
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          ))}

          {/* Area under line (apenas com 2+ pontos) */}
          {layout.area && (
            <motion.path
              d={layout.area}
              fill="url(#trend-fill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            />
          )}

          {/* Smooth line */}
          {points.length > 1 && (
            <motion.path
              d={layout.line}
              stroke="#A264D8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
            />
          )}

          {/* Hover bars (transparent capture areas) */}
          {layout.marks.map((m, i) => {
            const stepX =
              layout.marks.length > 1
                ? layout.innerW / (layout.marks.length - 1)
                : layout.innerW;
            return (
              <rect
                key={`hit-${i}`}
                x={m.x - stepX / 2}
                y={PAD_TOP}
                width={stepX}
                height={H - PAD_TOP - PAD_BOTTOM}
                fill="transparent"
                onMouseEnter={() => setHoverIdx(i)}
                style={{ cursor: "pointer" }}
              />
            );
          })}

          {/* Data points */}
          {layout.marks.map((m, i) => {
            const isHover = hoverIdx === i;
            const isLast = i === layout.marks.length - 1;
            const color = colorForNps(m.p.nps);
            return (
              <g key={`pt-${i}`} pointerEvents="none">
                <motion.circle
                  cx={m.x}
                  cy={m.y}
                  r={isHover || isLast ? 5 : 3.5}
                  fill="#0A0118"
                  stroke={color}
                  strokeWidth={isLast ? 2 : 1.5}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.06, duration: 0.3 }}
                />
                {isLast && (
                  <motion.circle
                    cx={m.x}
                    cy={m.y}
                    r="10"
                    fill="transparent"
                    stroke={color}
                    strokeOpacity="0.25"
                    strokeWidth="1"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatType: "loop" }}
                  />
                )}
              </g>
            );
          })}

          {/* X-axis labels — start, middle, end */}
          <g
            fontSize="10"
            fill="#6B5A82"
            fontFamily="var(--font-dm-sans), sans-serif"
            letterSpacing="0.05em"
          >
            <text x={layout.first!.x} y={H - 12} textAnchor="start">
              {fmtShort(layout.first!.p.date)}
            </text>
            {layout.marks.length > 2 && (
              <text
                x={layout.marks[Math.floor(layout.marks.length / 2)]!.x}
                y={H - 12}
                textAnchor="middle"
              >
                {fmtShort(layout.marks[Math.floor(layout.marks.length / 2)]!.p.date)}
              </text>
            )}
            {layout.marks.length > 1 && (
              <text x={last.x} y={H - 12} textAnchor="end">
                {fmtShort(last.p.date)}
              </text>
            )}
          </g>

          {/* Hover tooltip */}
          {hoverIdx !== null && layout.marks[hoverIdx] && (
            <Tooltip
              x={layout.marks[hoverIdx]!.x}
              y={layout.marks[hoverIdx]!.y}
              point={layout.marks[hoverIdx]!.p}
            />
          )}
        </svg>

        {/* Estado de "um único ponto" — sumário em texto abaixo */}
        {points.length === 1 && (
          <div className="mt-4 pt-4 border-t border-brand-border flex flex-wrap items-baseline justify-between gap-3">
            <span className="font-sans text-xs text-brand-muted">
              Apenas uma semana com respostas até agora — a curva começa a desenhar a
              partir da segunda semana.
            </span>
            <span className="font-sans text-xs text-brand-muted">
              {fmtLong(last.p.date)} · {last.p.total}{" "}
              {last.p.total === 1 ? "resposta" : "respostas"}
            </span>
          </div>
        )}
      </div>
    </Frame>
  );
}

function Tooltip({ x, y, point }: { x: number; y: number; point: TrendPoint }) {
  const color = colorForNps(point.nps);
  const align = x > W * 0.7 ? "end" : x < W * 0.3 ? "start" : "middle";
  const dx = align === "start" ? 8 : align === "end" ? -8 : 0;

  return (
    <g pointerEvents="none">
      <line
        x1={x}
        x2={x}
        y1={y - 8}
        y2={PAD_TOP - 2}
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.5"
        strokeDasharray="2 2"
      />
      <g transform={`translate(${x + dx}, ${PAD_TOP - 6})`}>
        <rect
          x={align === "end" ? -130 : align === "start" ? 0 : -65}
          y={-18}
          width="130"
          height="20"
          rx="4"
          fill="#150929"
          stroke="#241239"
        />
        <text
          x={align === "end" ? -8 : align === "start" ? 8 : 0}
          y={-4}
          fontSize="11"
          fill="#F4EEFB"
          fontFamily="var(--font-dm-sans), sans-serif"
          textAnchor={align === "end" ? "end" : align === "start" ? "start" : "middle"}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {fmtShort(point.date)} · {point.nps > 0 ? "+" : ""}
          {point.nps}
          {" · "}
          {point.total}{point.total === 1 ? " resp." : " resp."}
        </text>
      </g>
    </g>
  );
}

function Frame({
  title,
  subtitle,
  meta,
  children,
}: {
  title: string;
  subtitle: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-1">
        <div>
          <h3 className="font-sans text-sm font-medium uppercase tracking-[0.18em] text-brand-light">
            {title}
          </h3>
          <p className="mt-1 font-sans text-xs text-brand-muted">{subtitle}</p>
        </div>
        {meta}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
