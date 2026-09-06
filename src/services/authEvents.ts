import { clearStoredUser } from "@/utils/storage";

type LogoutListener = () => void;

const logoutListeners = new Set<LogoutListener>();

export function subscribeToLogout(listener: LogoutListener): () => void {
  logoutListeners.add(listener);
  return () => logoutListeners.delete(listener);
}

export function emitLogout(): void {
  for (const listener of logoutListeners) {
    try {
      listener();
    } catch {
      // noop
    }
  }
}

/**
  401 - Clear token 
 */
export async function forceLogout(_reason?: string): Promise<void> {
  clearStoredUser();
  emitLogout();
}

