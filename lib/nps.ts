import type { NpsBreakdown } from "@/types";

// Escala 0–5:
// 0,1,2 → detrator · 3 → neutro · 4,5 → promotor
export function classifyScore(score: number): "detractor" | "passive" | "promoter" {
  if (score <= 2) return "detractor";
  if (score === 3) return "passive";
  return "promoter";
}

export function computeNps(scores: number[]): NpsBreakdown {
  const total = scores.length;

  if (total === 0) {
    return {
      total: 0,
      promoters: 0,
      passives: 0,
      detractors: 0,
      promoterPct: 0,
      passivePct: 0,
      detractorPct: 0,
      score: 0,
      zone: "critical",
      zoneLabel: "Sem dados",
    };
  }

  let promoters = 0;
  let passives = 0;
  let detractors = 0;

  for (const s of scores) {
    const c = classifyScore(s);
    if (c === "promoter") promoters++;
    else if (c === "passive") passives++;
    else detractors++;
  }

  const promoterPct = (promoters / total) * 100;
  const passivePct = (passives / total) * 100;
  const detractorPct = (detractors / total) * 100;
  const score = Math.round(promoterPct - detractorPct);

  const { zone, zoneLabel } = describeZone(score);

  return {
    total,
    promoters,
    passives,
    detractors,
    promoterPct,
    passivePct,
    detractorPct,
    score,
    zone,
    zoneLabel,
  };
}

export function describeZone(score: number): {
  zone: NpsBreakdown["zone"];
  zoneLabel: string;
} {
  if (score < 0) return { zone: "critical", zoneLabel: "Zona Crítica" };
  if (score < 50) return { zone: "improvement", zoneLabel: "Zona de Melhoria" };
  if (score < 75) return { zone: "quality", zoneLabel: "Zona de Qualidade" };
  return { zone: "excellence", zoneLabel: "Zona de Excelência" };
}

export function colorForScore(avg: number | null | undefined): string {
  if (avg == null) return "#241239";
  if (avg < 3) return "#7A1F0E";
  if (avg < 4) return "#A88416";
  return "#2F6B3A";
}
