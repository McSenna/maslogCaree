import { createContext, useContext, type ReactNode } from "react";
import { useNotifications } from "@/hooks/useNotifications";

type NotificationsContextValue = ReturnType<typeof useNotifications>;

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

/**
 * One notification poller for the whole app.
 *
 * The unread count is shown in three places — the web header bell, the mobile
 * bottom-nav badge and the notifications screen — and they have to agree the
 * moment one item is opened. Sharing a single `useNotifications` instance is
 * what makes that true, and it also stops each consumer starting its own 15s
 * poll against the same endpoint.
 */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const value = useNotifications();

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      "useNotificationsContext must be used within NotificationsProvider"
    );
  }
  return ctx;
}
