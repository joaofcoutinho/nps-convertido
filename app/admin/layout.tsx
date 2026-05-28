"use client";

import { useEffect, useState } from "react";
import { AdminAuthContext, TOKEN_STORAGE_KEY } from "./auth";
import { LoginScreen } from "./LoginScreen";
import { AdminHeader } from "./AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    try {
      const t = window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (t) setToken(t);
    } catch {}
    setBootstrapped(true);
  }, []);

  function handleLogin(t: string) {
    try {
      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, t);
    } catch {}
    setToken(t);
  }

  function handleLogout() {
    try {
      window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {}
    setToken(null);
  }

  if (!bootstrapped) {
    return <main className="min-h-screen bg-brand-dark" />;
  }

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <AdminAuthContext.Provider value={{ token, logout: handleLogout }}>
      <main className="min-h-screen bg-brand-dark text-brand-light flex flex-col">
        <AdminHeader />
        {children}
      </main>
    </AdminAuthContext.Provider>
  );
}
