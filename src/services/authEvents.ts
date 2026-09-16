import { clearStoredUser } from "@/utils/storage";

type LogoutListener = () => void;

const logoutListeners = new Set<LogoutListener>();

export const subscribeToLogout = (listener: LogoutListener): () => void => {
  logoutListeners.add(listener);
  return () => logoutListeners.delete(listener);
};

export const emitLogout = (): void => {
  for (const listener of logoutListeners) {
    try {
      listener();
    } catch {
    }
  }
};

export const forceLogout = async (_reason?: string): Promise<void> => {
  clearStoredUser();
  emitLogout();
};

