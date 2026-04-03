import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const AUTH_KEY = "maslogcare_current_user";
const THEME_KEY = "maslogcare_ui_theme";

export type StoredTheme = "dark" | "light";

let memoryStore: Record<string, string> = {};

// In-memory cache so Axios interceptors can attach tokens synchronously.
let userCache: StoredUser | null = null;
let cacheHydrated = Platform.OS === "web";

function getStorage() {
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    return {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: (key: string) => localStorage.removeItem(key),
    };
  }
  return {
    getItem: (key: string) => memoryStore[key] ?? null,
    setItem: (key: string, value: string) => {
      memoryStore[key] = value;
    },
    removeItem: (key: string) => {
      delete memoryStore[key];
    },
  };
}

const storage = getStorage();

export interface StoredUser {
  id: string | number;
  name: string;
  email?: string;
  role: string;
  token?: string;
  avatarUrl?: string | null;
  /** ISO date string from profile (for resident UI without extra fetch) */
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  verified?: boolean;
}

const readStoredUserSync = (): StoredUser | null => {
  try {
    const raw = storage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredUser;
    return parsed;
  } catch {
    return null;
  }
}

if (cacheHydrated) {
  userCache = readStoredUserSync();
}

export async function hydrateAuthStorage(): Promise<void> {
  if (cacheHydrated) return;

  // For web we use localStorage synchronously; for native we hydrate async from SecureStore.
  if (Platform.OS === "web") {
    userCache = readStoredUserSync();
    cacheHydrated = true;
    return;
  }

  try {
    const raw = await SecureStore.getItemAsync(AUTH_KEY);
    userCache = raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    userCache = null;
  } finally {
    cacheHydrated = true;
  }
}

export function getCachedAccessToken(): string | null {
  return userCache?.token ?? null;
}

export function getStoredUser(): StoredUser | null {
  return userCache;
}

export function setStoredUser(user: StoredUser): void {
  // Update cache immediately so interceptors can attach it.
  userCache = user;
  cacheHydrated = true;

  storage.setItem(AUTH_KEY, JSON.stringify(user));

  if (Platform.OS !== "web") {
    void SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(user)).catch(() => {
      // If secure persistence fails, still keep in-memory behavior working.
    });
  }
}

export function clearStoredUser(): void {
  userCache = null;
  cacheHydrated = true;
  storage.removeItem(AUTH_KEY);

  if (Platform.OS !== "web") {
    void SecureStore.deleteItemAsync(AUTH_KEY).catch(() => {
      // noop
    });
  }
}

export function getStoredTheme(): StoredTheme | null {
  try {
    const raw = storage.getItem(THEME_KEY);
    if (raw === "dark" || raw === "light") return raw;
    return null;
  } catch {
    return null;
  }
}

export function setStoredTheme(theme: StoredTheme): void {
  try {
    storage.setItem(THEME_KEY, theme);
  } catch {
    // noop
  }
}
