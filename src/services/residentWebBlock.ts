// Transient UI state only. Every authorization decision remains on the server.
let blocked = false;
const listeners = new Set<() => void>();
export const isResidentWebBlocked = () => blocked;
export const subscribeResidentWebBlock = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const setResidentWebBlocked = (value: boolean) => {
  if (value === blocked) return;
  blocked = value;
  listeners.forEach((listener) => listener());
};
