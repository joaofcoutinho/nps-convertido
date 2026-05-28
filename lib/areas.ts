import type { AreaDefinition } from "@/types";

export const AREAS: AreaDefinition[] = [
  {
    key: "artes",
    label: "Artes",
    shortLabel: "Artes",
    question: "Como você avalia a qualidade e criatividade das artes entregues?",
    helper: "Considere conceito visual, execução e adequação à sua marca.",
  },
  {
    key: "website",
    label: "Website",
    shortLabel: "Website",
    question: "Como você avalia o resultado do seu site em design, navegação e performance?",
    helper: "Pense em estética, fluidez e experiência para seu cliente final.",
  },
  {
    key: "crm",
    label: "CRM",
    shortLabel: "CRM",
    question: "Como você avalia a gestão e automação do CRM conduzida pela Convertido?",
    helper: "Considere a organização da base, segmentações e disparos.",
  },
  {
    key: "copy",
    label: "Copy",
    shortLabel: "Copy",
    question: "Como você avalia a qualidade dos textos e mensagens criados para sua marca?",
    helper: "Pense em tom de voz, clareza e força de venda.",
  },
  {
    key: "filmmaker",
    label: "Filmmaker",
    shortLabel: "Filmmaker",
    question: "Como você avalia a produção audiovisual — conceito, captação e direção?",
    helper: "Considere ideia, qualidade técnica e direção em set.",
  },
  {
    key: "prazo",
    label: "Prazo de Execução",
    shortLabel: "Prazo",
    question: "Como você avalia o cumprimento dos prazos acordados pela equipe?",
  },
  {
    key: "planejamento",
    label: "Planejamento",
    shortLabel: "Planejamento",
    question: "Como você avalia a qualidade do planejamento estratégico da sua conta?",
    helper: "Considere estratégia, profundidade e direcionamento dos próximos passos.",
  },
  {
    key: "atendimento",
    label: "Atendimento",
    shortLabel: "Atendimento",
    question: "Como você avalia a atenção, agilidade e proatividade do nosso atendimento?",
  },
  {
    key: "edicao_video",
    label: "Edição de Vídeo",
    shortLabel: "Edição",
    question: "Como você avalia a qualidade da edição dos vídeos entregues?",
    helper: "Pense em ritmo, cortes, finalização e identidade visual.",
  },
  {
    key: "nps",
    label: "NPS Final",
    shortLabel: "NPS",
    question: "O quanto você recomendaria a Convertido para outro gestor ou empresa?",
    helper: "Sua resposta aqui define nosso indicador principal de satisfação.",
  },
];

export const AREA_BY_KEY: Record<string, AreaDefinition> = Object.fromEntries(
  AREAS.map((a) => [a.key, a])
);
