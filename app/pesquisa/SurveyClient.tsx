"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ProgressBar } from "@/components/ProgressBar";
import { ScoreSelector } from "@/components/ScoreSelector";
import { Button } from "@/components/Button";
import { AREAS } from "@/lib/areas";
import type { AreaKey } from "@/types";

type Scores = Partial<Record<AreaKey, number>>;

interface IdentityState {
  client_name: string;
  company: string;
}

// 12 steps total: identity (0) + 10 scored areas (1..10) + comment (11)
const TOTAL_STEPS = 12;

export function SurveyClient() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const [identity, setIdentity] = useState<IdentityState>({
    client_name: "",
    company: "",
  });
  const [scores, setScores] = useState<Scores>({});
  const [comentario, setComentario] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentArea = useMemo(() => {
    if (step >= 1 && step <= 10) return AREAS[step - 1];
    return null;
  }, [step]);

  const canProceed = useMemo(() => {
    if (step === 0) return identity.client_name.trim().length >= 2;
    if (step >= 1 && step <= 10) {
      return currentArea ? typeof scores[currentArea.key] === "number" : false;
    }
    return true; // comment step is optional
  }, [step, identity.client_name, scores, currentArea]);

  function go(next: number) {
    setSubmitError(null);
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  function handleNext() {
    if (!canProceed) return;
    if (step < TOTAL_STEPS - 1) go(step + 1);
    else void submit();
  }

  function handleBack() {
    if (step > 0) go(step - 1);
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        client_name: identity.client_name.trim(),
        company: identity.company.trim() || undefined,
        score_artes: scores.artes,
        score_website: scores.website,
        score_crm: scores.crm,
        score_copy: scores.copy,
        score_filmmaker: scores.filmmaker,
        score_prazo: scores.prazo,
        score_planejamento: scores.planejamento,
        score_atendimento: scores.atendimento,
        score_edicao_video: scores.edicao_video,
        score_nps: scores.nps,
        comentario: comentario.trim() || undefined,
      };

      const res = await fetch("/api/submit-nps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Não foi possível enviar sua avaliação.");
      }

      router.push("/obrigado");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro inesperado.";
      setSubmitError(msg);
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col bg-brand-dark text-brand-light overflow-hidden">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(162,100,216,0.10) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      <header className="relative z-10 px-6 sm:px-10 lg:px-16 pt-6 sm:pt-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Logo size="sm" />
          <button
            type="button"
            onClick={() => router.push("/")}
            className="font-sans text-xs uppercase tracking-[0.18em] text-brand-muted hover:text-brand-light transition-colors"
          >
            Sair
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-6">
          <ProgressBar current={step + 1} total={TOTAL_STEPS} />
        </div>
      </header>

      <section className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16 py-12">
        <div className="max-w-3xl w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -32 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {step === 0 && (
                <IdentityStep
                  value={identity}
                  onChange={setIdentity}
                  onEnter={handleNext}
                />
              )}

              {currentArea && (
                <QuestionStep
                  index={step}
                  area={currentArea}
                  value={scores[currentArea.key] ?? null}
                  onChange={(v) =>
                    setScores((prev) => ({ ...prev, [currentArea.key]: v }))
                  }
                />
              )}

              {step === 11 && (
                <CommentStep
                  value={comentario}
                  onChange={setComentario}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {submitError && (
            <p className="mt-6 text-sm font-sans text-[#FF6F61] text-center">
              {submitError}
            </p>
          )}
        </div>
      </section>

      <footer className="relative z-10 px-6 sm:px-10 lg:px-16 pb-8 sm:pb-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0 || submitting}
            className={step === 0 ? "invisible" : ""}
          >
            ← Voltar
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            disabled={!canProceed || submitting}
          >
            {submitting
              ? "Enviando..."
              : step === TOTAL_STEPS - 1
              ? "Enviar avaliação"
              : "Próximo →"}
          </Button>
        </div>
      </footer>
    </main>
  );
}

/* ---------- Step components ---------- */

function StepLabel({ index, total }: { index: number; total: number }) {
  return (
    <span className="font-sans text-xs uppercase tracking-[0.22em] text-brand-muted">
      Pergunta {index} de {total}
    </span>
  );
}

function IdentityStep({
  value,
  onChange,
  onEnter,
}: {
  value: IdentityState;
  onChange: (next: IdentityState) => void;
  onEnter: () => void;
}) {
  return (
    <div className="text-center sm:text-left">
      <span className="font-sans text-xs uppercase tracking-[0.22em] text-brand-muted">
        Antes de começar
      </span>
      <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-[1.05] tracking-tight-display">
        Como podemos
        <br />
        <span className="italic" style={{ color: "var(--color-brand-primary)" }}>
          te chamar?
        </span>
      </h2>
      <p className="mt-4 font-sans text-brand-light/70 max-w-md sm:mx-0 mx-auto">
        Sua identificação ajuda nosso time a entender o contexto da sua avaliação.
      </p>

      <div className="mt-10 space-y-6 max-w-md mx-auto sm:mx-0">
        <Field label="Seu nome" required>
          <input
            type="text"
            autoFocus
            value={value.client_name}
            onChange={(e) => onChange({ ...value, client_name: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.client_name.trim().length >= 2) {
                e.preventDefault();
                onEnter();
              }
            }}
            placeholder="Ex.: Joana Lima"
            className="w-full bg-transparent border-b border-brand-border focus:border-brand-primary outline-none py-2 font-sans text-lg text-brand-light placeholder:text-brand-muted/60 transition-colors"
          />
        </Field>
        <Field label="Empresa (opcional)">
          <input
            type="text"
            value={value.company}
            onChange={(e) => onChange({ ...value, company: e.target.value })}
            placeholder="Ex.: Atelier Lima"
            className="w-full bg-transparent border-b border-brand-border focus:border-brand-primary outline-none py-2 font-sans text-lg text-brand-light placeholder:text-brand-muted/60 transition-colors"
          />
        </Field>
      </div>
    </div>
  );
}

function QuestionStep({
  index,
  area,
  value,
  onChange,
}: {
  index: number;
  area: (typeof AREAS)[number];
  value: number | null;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-4">
        <StepLabel index={index} total={11} />
        <span className="font-sans text-xs text-brand-muted">·</span>
        <span
          className="font-sans text-xs uppercase tracking-[0.22em] font-bold"
          style={{ color: "var(--color-brand-primary)" }}
        >
          {area.label}
        </span>
      </div>

      <h2 className="mt-5 font-display text-3xl sm:text-4xl leading-[1.15] tracking-tight-display text-brand-light max-w-2xl">
        {area.question}
      </h2>

      {area.helper && (
        <p className="mt-4 font-sans text-sm text-brand-muted max-w-xl">
          {area.helper}
        </p>
      )}

      <div className="mt-10">
        <ScoreSelector value={value} onChange={onChange} />
      </div>
    </div>
  );
}

function CommentStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="font-sans text-xs uppercase tracking-[0.22em] text-brand-muted">
        Para fechar
      </span>
      <h2 className="mt-5 font-display text-3xl sm:text-4xl leading-[1.15] tracking-tight-display text-brand-light max-w-2xl">
        Tem algo que podemos melhorar
        <br />
        <span className="italic" style={{ color: "var(--color-brand-primary)" }}>
          ou quer destacar?
        </span>
      </h2>
      <p className="mt-4 font-sans text-sm text-brand-muted max-w-xl">
        Este campo é opcional, mas o que você escrever aqui chega direto ao time
        responsável pela sua conta.
      </p>

      <div className="mt-8">
        <textarea
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escreva à vontade — sem fórmula, sem censura."
          className="w-full bg-brand-surface border border-brand-border rounded-lg p-4 font-sans text-base text-brand-light placeholder:text-brand-muted/60 focus:border-brand-primary outline-none transition-colors resize-none"
        />
        <div className="mt-2 text-right font-sans text-xs text-brand-muted">
          {value.length} / 2000
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-brand-muted">
        {label}
        {required && <span className="ml-1 text-brand-primary">*</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
