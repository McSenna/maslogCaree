export type ToastTone = "success" | "error" | "info";

export type ToastAction = { label: string; onPress: () => void };

export type ToastMessage = {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
  action?: ToastAction;
  durationMs: number;
};

type Listener = (toast: ToastMessage | null) => void;

const DURATION: Record<ToastTone, number> = { success: 3200, info: 3600, error: 5200 };

let current: ToastMessage | null = null;
let nextId = 1;
let bottomOffset = 0;
const listeners = new Set<Listener>();
const offsetListeners = new Set<(offset: number) => void>();

const emit = () => listeners.forEach((listener) => listener(current));

export const subscribeToToasts = (listener: Listener): (() => void) => {
  listeners.add(listener);
  listener(current);
  return () => {
    listeners.delete(listener);
  };
};

export const showToast = (
  tone: ToastTone,
  title: string,
  options: { description?: string; action?: ToastAction; durationMs?: number } = {}
): number => {
  const id = nextId++;
  current = { id, tone, title, ...options, durationMs: options.durationMs ?? DURATION[tone] };
  emit();
  return id;
};

export const dismissToast = (id?: number): void => {
  if (!current || (id !== undefined && current.id !== id)) return;
  current = null;
  emit();
};

export const toast = {
  success: (title: string, description?: string) => showToast("success", title, { description }),
  error: (title: string, description?: string, action?: ToastAction) =>
    showToast("error", title, { description, action }),
  info: (title: string, description?: string) => showToast("info", title, { description }),
};

export const setToastBottomOffset = (offset: number): void => {
  bottomOffset = offset;
  offsetListeners.forEach((listener) => listener(offset));
};

export const subscribeToToastOffset = (listener: (offset: number) => void): (() => void) => {
  offsetListeners.add(listener);
  listener(bottomOffset);
  return () => {
    offsetListeners.delete(listener);
  };
};

export const notifyToast = (message: string, tone: "success" | "error" = "success"): void => {
  showToast(tone, message);
};
