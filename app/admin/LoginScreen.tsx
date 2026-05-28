"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { encodeToken } from "./auth";

interface LoginScreenProps {
  onLogin: (token: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = encodeToken(email.trim(), password);
      const res = await fetch("/api/results?period=all&page=1&pageSize=1", {
        headers: { Authorization: `Basic ${token}` },
      });
      if (res.status === 401) {
        setError("Email ou senha incorretos.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Não foi possível autenticar.");
        setLoading(false);
        return;
      }
      onLogin(token);
    } catch {
      setError("Erro de conexão.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:grid lg:grid-cols-12 bg-brand-dark text-brand-light overflow-hidden">
      <aside className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative flex-col justify-between p-12 xl:p-16 border-r border-brand-border">
        <div
          aria-hidden
          className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(162,100,216,0.10) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />

        <Logo size="md" />

        <div className="relative max-w-md">
          <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-brand-muted">
            Painel restrito · Equipe Convertido
          </span>
          <h2 className="mt-5 font-display text-5xl xl:text-6xl leading-[1.02] tracking-tight-display">
            Cada nota
            <br />
            vira{" "}
            <span className="italic" style={{ color: "var(--color-brand-primary)" }}>
              direção
            </span>
            .
          </h2>
          <p className="mt-6 font-sans text-base text-brand-light/70 leading-relaxed">
            O que seus clientes respondem aqui é o briefing mais honesto que sua conta
            pode receber. Faça bom uso.
          </p>
        </div>

        <span className="relative font-sans text-[10px] uppercase tracking-[0.22em] text-brand-muted">
          convertido.com.br
        </span>
      </aside>

      <section className="flex-1 lg:col-span-7 xl:col-span-6 flex flex-col px-6 sm:px-10">
        <header className="lg:hidden pt-8">
          <div className="max-w-6xl mx-auto">
            <Logo size="sm" />
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center py-10">
          <motion.form
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            onSubmit={submit}
            className="w-full max-w-md"
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-block w-8 h-[1px]"
                style={{ backgroundColor: "var(--color-brand-primary)" }}
              />
              <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-brand-muted">
                Entrar
              </span>
            </div>

            <h1 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight-display leading-[1.05]">
              Acesso da{" "}
              <span className="italic" style={{ color: "var(--color-brand-primary)" }}>
                equipe
              </span>
            </h1>
            <p className="mt-3 font-sans text-sm text-brand-muted max-w-sm">
              Informe email e senha para visualizar o painel de satisfação.
            </p>

            <div className="mt-10 space-y-7">
              <FormField label="Email">
                <input
                  type="email"
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-brand-border focus:border-brand-primary outline-none py-2 font-sans text-base text-brand-light placeholder:text-brand-muted/50 transition-colors"
                  placeholder="seu@convertido.com.br"
                />
              </FormField>

              <FormField label="Senha">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-brand-border focus:border-brand-primary outline-none py-2 pr-10 font-sans text-base text-brand-light placeholder:text-brand-muted/50 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={showPassword}
                    className="absolute right-0 bottom-2 p-1 text-brand-muted hover:text-brand-light transition-colors"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </FormField>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key={error}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6 font-sans text-sm text-[#FF6F61]"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between gap-4">
              <span className="font-sans text-xs text-brand-muted">
                Acesso somente para equipe interna.
              </span>
              <Button
                type="submit"
                disabled={loading || email.length === 0 || password.length === 0}
              >
                {loading ? "Validando..." : "Entrar →"}
              </Button>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-brand-muted">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A10.94 10.94 0 0 1 12 6c6.5 0 10 7 10 7a17.9 17.9 0 0 1-3.07 4.16" />
      <path d="M6.6 6.6A17.83 17.83 0 0 0 2 12s3.5 7 10 7a10.94 10.94 0 0 0 5.4-1.36" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
