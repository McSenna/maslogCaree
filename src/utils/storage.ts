import { Platform } from "react-native";

const AUTH_KEY = "maslogcare_current_user";

let memoryStore: Record<string, string> = {};

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
}

export function getStoredUser(): StoredUser | null {
  try {
    const raw = storage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: StoredUser): void {
  storage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  storage.removeItem(AUTH_KEY);
}
