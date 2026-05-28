"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useAdminAuth } from "./auth";

const NAV = [
  { label: "Resumo", href: "/admin", match: (p: string) => p === "/admin" },
  {
    label: "Respostas",
    href: "/admin/respostas",
    match: (p: string) => p.startsWith("/admin/respostas"),
  },
];

export function AdminHeader() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  return (
    <header className="px-6 sm:px-10 lg:px-16 pt-6 pb-5 border-b border-brand-border bg-brand-dark/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-x-6">
        <div className="flex items-center gap-6 min-w-0">
          <Logo size="sm" href="/admin" />
          <nav className="flex items-center gap-1 sm:gap-2">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-1.5 font-sans text-xs uppercase tracking-[0.22em] transition-colors ${
                    active
                      ? "text-brand-light"
                      : "text-brand-muted hover:text-brand-light"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={logout}
          className="font-sans text-[10px] uppercase tracking-[0.22em] text-brand-muted hover:text-brand-light transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
