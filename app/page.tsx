import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col bg-brand-dark text-brand-light overflow-hidden grain">
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(162,100,216,0.22) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-60 -left-60 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(185,135,230,0.14) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <header className="relative z-10 px-6 sm:px-10 lg:px-16 pt-8 sm:pt-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          <span className="hidden sm:inline-block font-sans text-xs uppercase tracking-[0.2em] text-brand-muted">
            Pesquisa de Satisfação · 2026
          </span>
        </div>
      </header>

      <section className="relative z-10 flex-1 flex items-center px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-10 lg:gap-16 items-center py-16">
          <div className="lg:col-span-7 animate-fade-up">
            <span className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.22em] text-brand-muted">
              <span
                className="inline-block w-6 h-[1px]"
                style={{ backgroundColor: "var(--color-brand-primary)" }}
              />
              Sua opinião, registrada com atenção
            </span>

            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight-display text-brand-light">
              Como estamos
              <br />
              <span className="italic" style={{ color: "var(--color-brand-primary)" }}>
                nos saindo?
              </span>
            </h1>

            <p className="mt-8 max-w-xl font-sans text-lg text-brand-light/80 leading-relaxed">
              Esta pesquisa leva menos de 3 minutos e nos ajuda a entregar resultados
              cada vez melhores para a sua conta. Sua resposta vai direto para o time
              que cuida de você.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Link
                href="/pesquisa"
                className="group inline-flex items-center gap-3 bg-brand-primary text-white px-7 py-4 rounded-md font-sans text-sm font-medium hover:bg-brand-accent transition-all shadow-[0_18px_40px_-16px_rgba(162,100,216,0.65)] hover:shadow-[0_22px_50px_-14px_rgba(162,100,216,0.75)] hover:-translate-y-0.5"
              >
                Começar avaliação
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <span className="font-sans text-xs text-brand-muted">
                10 perguntas curtas · ~3 minutos
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative bg-brand-surface/60 backdrop-blur-sm border border-brand-border rounded-2xl p-8 lg:p-10">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-muted">
                O que vamos perguntar
              </span>
              <ul className="mt-6 space-y-4">
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
                  <li key={item} className="flex items-baseline gap-4">
                    <span className="font-sans text-xs tabular-nums text-brand-muted w-5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-sm text-brand-light/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-6 sm:px-10 lg:px-16 pb-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
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
