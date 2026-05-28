import { z } from "zod";

const scoreField = z
  .number({ invalid_type_error: "Selecione uma nota de 0 a 5." })
  .int()
  .min(0)
  .max(5);

const optionalScoreField = scoreField.optional().nullable();

export const npsSubmissionSchema = z.object({
  client_name: z
    .string({ required_error: "Informe seu nome." })
    .trim()
    .min(2, "Nome muito curto.")
    .max(255, "Nome muito longo."),
  company: z
    .string()
    .trim()
    .max(255, "Nome de empresa muito longo.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  score_artes: optionalScoreField,
  score_website: optionalScoreField,
  score_crm: optionalScoreField,
  score_copy: optionalScoreField,
  score_filmmaker: optionalScoreField,
  score_prazo: optionalScoreField,
  score_planejamento: optionalScoreField,
  score_atendimento: optionalScoreField,
  score_edicao_video: optionalScoreField,
  score_nps: scoreField,
  comentario: z
    .string()
    .trim()
    .max(2000, "Comentário muito longo (máx. 2000 caracteres).")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type NpsSubmission = z.infer<typeof npsSubmissionSchema>;
