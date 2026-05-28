export type AreaKey =
  | "artes"
  | "website"
  | "crm"
  | "copy"
  | "filmmaker"
  | "prazo"
  | "planejamento"
  | "atendimento"
  | "edicao_video"
  | "nps";

export interface AreaDefinition {
  key: AreaKey;
  label: string;
  shortLabel: string;
  question: string;
  helper?: string;
}

export interface AreaAverage {
  key: AreaKey;
  label: string;
  average: number;
  total: number;
}

export interface NpsBreakdown {
  total: number;
  promoters: number;
  passives: number;
  detractors: number;
  promoterPct: number;
  passivePct: number;
  detractorPct: number;
  score: number;
  zone: "critical" | "improvement" | "quality" | "excellence";
  zoneLabel: string;
}

export interface ResponseRow {
  id: number;
  clientName: string;
  company: string | null;
  scoreNps: number;
  scoreArtes: number | null;
  scoreWebsite: number | null;
  scoreCrm: number | null;
  scoreCopy: number | null;
  scoreFilmmaker: number | null;
  scorePrazo: number | null;
  scorePlanejamento: number | null;
  scoreAtendimento: number | null;
  scoreEdicaoVideo: number | null;
  comentario: string | null;
  createdAt: string;
}

export interface TrendPoint {
  date: string;
  nps: number;
  total: number;
}

export interface ResultsPayload {
  generatedAt: string;
  totalResponses: number;
  averages: AreaAverage[];
  nps: NpsBreakdown;
  trend: {
    bucket: "month";
    points: TrendPoint[];
  };
  responses: {
    items: ResponseRow[];
    page: number;
    pageSize: number;
    total: number;
  };
  filters: {
    period: PeriodFilter;
    bucket: BucketFilter;
  };
}

export type PeriodFilter = "7d" | "30d" | "90d" | "all";
export type BucketFilter = "all" | "promoters" | "passives" | "detractors";
