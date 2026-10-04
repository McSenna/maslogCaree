import type {
  ConnectionStatus,
  RealtimeAction,
  RealtimeChange,
  RealtimeRecordMap,
  RealtimeResource,
} from "@/types/realtime";

// The one place socket events meet hooks. The socket instance is replaced on
// every sign-in, so hooks subscribe here instead and never re-subscribe when it
// changes. Kept free of React and socket.io so it runs under `node --test`.

type Listener = (payload: unknown) => void;

const ACTIONS: readonly RealtimeAction[] = ["created", "updated", "deleted", "resync"];

const eventListeners = new Map<string, Set<Listener>>();

export const dispatchRealtimeEvent = (eventName: string, payload: unknown): void => {
  const listeners = eventListeners.get(eventName);
  if (!listeners) return;
  for (const listener of [...listeners]) listener(payload);
};

const onEvent = (eventName: string, listener: Listener): (() => void) => {
  const listeners = eventListeners.get(eventName) ?? new Set<Listener>();
  listeners.add(listener);
  eventListeners.set(eventName, listeners);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) eventListeners.delete(eventName);
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Narrows a raw socket payload into a change; anything malformed is dropped. */
export const toChange = <T>(action: RealtimeAction, payload: unknown): RealtimeChange<T> | null => {
  if (action === "resync") return { action };
  if (!isRecord(payload)) return null;
  if (action === "deleted") return typeof payload.id === "string" ? { action, id: payload.id } : null;
  return { action, record: payload as T };
};

export const subscribeToResource = <R extends RealtimeResource>(
  resource: R,
  handler: (change: RealtimeChange<RealtimeRecordMap[R]>) => void
): (() => void) => {
  const unsubscribers = ACTIONS.map((action) =>
    onEvent(`${resource}:${action}`, (payload) => {
      const change = toChange<RealtimeRecordMap[R]>(action, payload);
      if (change) handler(change);
    })
  );
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
};

// "Reload what you show": fired on every (re)connect, when the server says it
// may have missed changes, and when the app returns to the foreground.
type ResyncListener = (at: number) => void;
const resyncListeners = new Set<ResyncListener>();

export const requestResync = (at: number = Date.now()): void => {
  for (const listener of [...resyncListeners]) listener(at);
};

export const onResync = (listener: ResyncListener): (() => void) => {
  resyncListeners.add(listener);
  return () => {
    resyncListeners.delete(listener);
  };
};

let status: ConnectionStatus = "idle";
const statusListeners = new Set<() => void>();

export const getConnectionStatus = (): ConnectionStatus => status;

export const setConnectionStatus = (next: ConnectionStatus): void => {
  if (next === status) return;
  status = next;
  for (const listener of [...statusListeners]) listener();
};

export const subscribeConnectionStatus = (listener: () => void): (() => void) => {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
};
