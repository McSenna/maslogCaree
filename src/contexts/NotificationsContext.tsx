import { createContext, useContext, type ReactNode } from "react";
import { useNotifications } from "@/hooks/useNotifications";

type NotificationsContextValue = ReturnType<typeof useNotifications>;

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const value = useNotifications();

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = (): NotificationsContextValue => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      "useNotificationsContext must be used within NotificationsProvider"
    );
  }
  return ctx;
};
