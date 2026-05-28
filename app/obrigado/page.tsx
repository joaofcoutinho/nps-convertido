"use client";

import { motion } from "framer-motion";
import { AnimatedCheck } from "@/components/AnimatedCheck";
import { Logo } from "@/components/Logo";

export default function ObrigadoPage() {
  return (
    <main className="relative min-h-screen flex flex-col bg-brand-dark text-brand-light overflow-hidden grain">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(162,100,216,0.14) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      <header className="relative z-10 px-6 sm:px-10 lg:px-16 pt-8 sm:pt-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
        </div>
      </header>

      <section className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-2xl w-full text-center"
        >
          <div className="flex justify-center">
            <AnimatedCheck size={96} />
          </div>

          <h1 className="mt-10 font-display text-5xl sm:text-6xl leading-[1.05] tracking-tight-display">
            Obrigado pela sua
            <br />
            <span className="italic" style={{ color: "var(--color-brand-primary)" }}>
              confiança.
            </span>
          </h1>

          <p className="mt-8 font-sans text-lg text-brand-light/80 leading-relaxed max-w-lg mx-auto">
            Sua avaliação foi registrada e será analisada com atenção pelo nosso time.
            Cada nota e comentário viram ação concreta na sua conta.
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-12 font-display text-xl italic text-brand-muted"
          >
            — Equipe Convertido
          </motion.p>
        </motion.div>
      </section>

      <footer className="relative z-10 px-6 sm:px-10 lg:px-16 pb-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-sans text-xs text-brand-muted">
            Convertido Marketing · convertido.com.br
          </p>
        </div>
      </footer>
    </main>
  );
}
