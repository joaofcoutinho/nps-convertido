import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col bg-brand-dark text-brand-light overflow-hidden grain">
      <div
        aria-hidden
        className="absolute top-[-280px] left-1/2 -translate-x-1/2 w-[820px] h-[820px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(162,100,216,0.20) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-60 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(185,135,230,0.12) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <header className="relative z-10 px-6 sm:px-10 lg:px-16 pt-8 sm:pt-10">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
          <Logo />
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.22em] text-brand-muted">
            Pesquisa de Satisfação · 2026
          </span>
        </div>
      </header>

      <section className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center py-16 animate-fade-up">
          <span className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.22em] text-brand-muted">
            <span
              className="inline-block w-6 h-[1px]"
              style={{ backgroundColor: "var(--color-brand-primary)" }}
            />
            Sua opinião, registrada com atenção
            <span
              className="inline-block w-6 h-[1px]"
              style={{ backgroundColor: "var(--color-brand-primary)" }}
            />
          </span>

          <h1 className="mt-7 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight-display text-brand-light">
            Como estamos
            <br />
            <span className="italic" style={{ color: "var(--color-brand-primary)" }}>
              nos saindo?
            </span>
          </h1>

          <p className="mt-8 max-w-xl font-sans text-base sm:text-lg text-brand-light/85 leading-relaxed">
            Esta pesquisa leva menos de 3 minutos e nos ajuda a entregar resultados
            cada vez melhores para a sua conta. Sua resposta vai direto para o time
            que cuida de você.
          </p>

          <Link
            href="/pesquisa"
            className="group mt-10 inline-flex items-center gap-3 bg-brand-primary text-white px-8 py-4 rounded-md font-sans text-sm font-medium hover:bg-brand-accent transition-all shadow-[0_18px_40px_-16px_rgba(162,100,216,0.65)] hover:shadow-[0_22px_50px_-14px_rgba(162,100,216,0.75)] hover:-translate-y-0.5"
          >
            Começar avaliação
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <span className="mt-3 font-sans text-xs text-brand-muted">
            10 perguntas curtas · ~3 minutos
          </span>

          <div className="mt-16 w-full max-w-lg bg-brand-surface/60 backdrop-blur-sm border border-brand-border rounded-2xl p-8 text-left">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span
                aria-hidden
                className="inline-block w-4 h-[1px]"
                style={{ backgroundColor: "var(--color-brand-muted)" }}
              />
              <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-brand-muted">
                O que vamos perguntar
              </span>
              <span
                aria-hidden
                className="inline-block w-4 h-[1px]"
                style={{ backgroundColor: "var(--color-brand-muted)" }}
              />
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {[
                "Artes & criação visual",
                "Website & performance",
                "CRM & automações",
                "Copy & mensagens",
                "Filmmaker & produção",
                "Prazos & planejamento",
                "Atendimento & relação",
                "Edição de vídeo",
                "Recomendação geral",
              ].map((item, i) => (
                <li key={item} className="flex items-baseline gap-3">
                  <span className="font-sans text-xs tabular-nums text-brand-muted w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-sm text-brand-light/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-6 sm:px-10 lg:px-16 pb-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-2 text-center">
          <p className="font-sans text-xs text-brand-muted">
            Seus dados são confidenciais e usados apenas para melhoria interna.
          </p>
          <p className="font-sans text-xs text-brand-muted">
            Convertido Marketing · convertido.com.br
          </p>
        </div>
      </footer>
    </main>
  );
}
