import type { ClientPlatform } from "@/config/platformAccess";
import { clearStoredUser } from "@/utils/storage";

export const getTokenPlatform = (token: string): ClientPlatform | null => {
  const payload = decodeJwtPayload(token);
  const platform = typeof payload?.platform === "string" ? payload.platform : null;
  return platform === "web" || platform === "mobile" ? platform : null;
};

export const logout = (): boolean => {
  try {
    clearStoredUser();
    return true;
  } catch (error) {
    console.warn("Failed to clear stored session", error);
    return false;
  }
};

interface JwtPayload {
  exp?: number;
  platform?: string;
  role?: string;
  sessionId?: string;
}

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = (4 - (b64.length % 4)) % 4;
    const padded = b64 + "=".repeat(pad);
    const atobFn = typeof globalThis.atob === "function" ? globalThis.atob.bind(globalThis) : null;
    if (!atobFn) return null;
    return JSON.parse(atobFn(padded)) as JwtPayload;
  } catch {
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  if (!token || token.split(".").length !== 3) return false;
  const exp = decodeJwtPayload(token)?.exp;
  if (exp == null) return false;
  return Date.now() < exp * 1000;
};
