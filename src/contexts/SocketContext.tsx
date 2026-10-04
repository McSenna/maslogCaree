import { useEffect, type ReactNode } from "react";
import { AppState, Platform } from "react-native";

import { toast } from "@/components/feedback/toast/toastStore";
import { useAuth } from "@/contexts/AuthContext";
import { closeSocket, openSocket, pauseSocket, resumeSocket } from "@/lib/socket";
import { createConnectionNotice } from "@/lib/realtime/connectionNotice";
import { getConnectionStatus, subscribeConnectionStatus } from "@/lib/realtime/realtimeBus";

const CONNECTION_LOST = {
  title: "Live updates paused",
  description: "Lists show what was last loaded and update again once the connection is back.",
};

/**
 * Owns the realtime connection's lifecycle: open on sign-in, reopen when the
 * signed-in account changes (a shared health center tablet), close on sign-out.
 */
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const accountId = user ? String(user.id) : null;

  useEffect(() => {
    if (!accountId) return;
    openSocket();
    return closeSocket;
  }, [accountId]);

  // Android and iOS suspend background sockets anyway; closing first saves the
  // battery and frees the server slot, and the reconnect on return reloads every
  // open list. Browser tabs keep their connection.
  useEffect(() => {
    if (!accountId || Platform.OS === "web") return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") resumeSocket();
      else if (state === "background") pauseSocket();
    });
    return () => subscription.remove();
  }, [accountId]);

  // The only sign of a lost connection: told once per outage, not on every retry.
  useEffect(() => {
    const notice = createConnectionNotice(() => toast.error(CONNECTION_LOST.title, CONNECTION_LOST.description));
    return subscribeConnectionStatus(() => notice(getConnectionStatus()));
  }, []);

  return <>{children}</>;
};
