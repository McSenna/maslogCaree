import { io, type Socket } from "socket.io-client";

import { CLIENT_PLATFORM } from "@/config/platformAccess";
import { getApiBaseURL } from "@/services/api";
import { forceLogout } from "@/services/authEvents";
import { getCachedAccessToken, getStoredUser } from "@/utils/storage";
import { dispatchRealtimeEvent, requestResync, setConnectionStatus } from "@/lib/realtime/realtimeBus";

// Codes the server's handshake shares with REST 401/403s. Any other refusal
// (SERVER_UNAVAILABLE) is a server fault and is retried, never a sign-out.
const AUTH_REFUSALS = new Set([
  "AUTHENTICATION_REQUIRED",
  "TOKEN_EXPIRED",
  "INVALID_TOKEN",
  "ACCOUNT_NOT_FOUND",
  "ACCOUNT_UNVERIFIED",
  "ACCOUNT_DISABLED",
  "PLATFORM_ACCESS_DENIED",
  "RESIDENT_WEB_ACCESS_DENIED",
  "PLATFORM_CONTEXT_MISMATCH",
]);

const RESYNC_EVERYTHING = "realtime:resync";
// After this many failed attempts the indicator says "offline"; retries continue in the background.
const OFFLINE_AFTER_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [2000, 5000, 15000, 30000];

let socket: Socket | null = null;

/** The API host without its /api suffix: Socket.IO shares the REST server and port. */
const serverOrigin = () => getApiBaseURL().replace(/\/api\/?$/, "");

const refusalCode = (error: Error): string | null => {
  const data = (error as Error & { data?: { code?: unknown } }).data;
  return typeof data?.code === "string" ? data.code : null;
};

// Mirrors the REST client's escape hatch (services/api.ts) so both channels
// treat an admin's refused session the same way.
const keepsSessionOnRefusal = () =>
  process.env.EXPO_PUBLIC_ADMIN_401_NO_LOGOUT === "1" && getStoredUser()?.role === "admin";

const handleRefusal = (instance: Socket, error: Error, attempt: number) => {
  const code = refusalCode(error);
  if (code && AUTH_REFUSALS.has(code)) {
    closeSocket();
    // No token means this device already signed out; nothing left to end.
    if (getCachedAccessToken() && !keepsSessionOnRefusal()) void forceLogout(code);
    return;
  }
  setConnectionStatus(attempt >= OFFLINE_AFTER_ATTEMPTS ? "offline" : "reconnecting");
  // A refusal from the server's middleware stops Socket.IO's own retries, so
  // back off and retry here; transport failures are retried by Socket.IO itself.
  if (!instance.active) {
    const delay = RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)];
    setTimeout(() => socket === instance && instance.connect(), delay);
  }
};

const attachHandlers = (instance: Socket) => {
  let failedAttempts = 0;

  instance.on("connect", () => {
    failedAttempts = 0;
    setConnectionStatus("connected");
    // Anything that changed while this device was not listening is reloaded.
    requestResync();
  });

  instance.on("disconnect", (reason) => {
    // A client disconnect is a deliberate pause or sign-out, already reflected in the status.
    if (socket !== instance || reason === "io client disconnect") return;
    setConnectionStatus("reconnecting");
    // The server dropped this socket on purpose (token expired, account
    // suspended, role changed). Socket.IO does not retry that, so try once:
    // the handshake then either signs the user out or rejoins the right rooms.
    if (reason === "io server disconnect" && getCachedAccessToken()) instance.connect();
  });

  instance.on("connect_error", (error) => {
    failedAttempts += 1;
    handleRefusal(instance, error, failedAttempts);
  });

  instance.on(RESYNC_EVERYTHING, () => requestResync());
  instance.onAny((eventName: string, payload: unknown) => dispatchRealtimeEvent(eventName, payload));
};

/** Opens the one shared connection for the signed-in user. Safe to call twice. */
export const openSocket = (): void => {
  if (socket) return;

  const instance = io(serverOrigin(), {
    // WebSocket only: no long-polling fallback, so no sticky sessions are
    // needed behind a load balancer, and the Origin rule on the server applies.
    transports: ["websocket"],
    // Read on every attempt, so a reconnect never sends an old token.
    auth: (send) => send({ token: getCachedAccessToken() ?? "", platform: CLIENT_PLATFORM }),
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 15000,
    randomizationFactor: 0.5,
    timeout: 10000,
  });

  socket = instance;
  setConnectionStatus("connecting");
  attachHandlers(instance);
};

/** Ends the connection: on sign-out, account switch, or app moving to the background. */
export const closeSocket = (): void => {
  const instance = socket;
  socket = null;
  if (instance) {
    instance.removeAllListeners();
    instance.offAny();
    instance.disconnect();
  }
  setConnectionStatus("idle");
};

/** Reconnects after the app returns to the foreground; the connect handler then resyncs. */
export const resumeSocket = (): void => {
  if (!socket) openSocket();
  else if (!socket.connected) socket.connect();
};

export const pauseSocket = (): void => {
  if (!socket) return;
  socket.disconnect();
  setConnectionStatus("idle");
};
