"use client";

import { createContext, useContext } from "react";

export const TOKEN_STORAGE_KEY = "convertido_admin_token";

export interface AdminAuth {
  token: string;
  logout: () => void;
}

export const AdminAuthContext = createContext<AdminAuth | null>(null);

export function useAdminAuth(): AdminAuth {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth precisa ser usado dentro do layout /admin.");
  }
  return ctx;
}

export function encodeToken(email: string, password: string): string {
  if (typeof window === "undefined") return "";
  return window.btoa(`${email}:${password}`);
}
