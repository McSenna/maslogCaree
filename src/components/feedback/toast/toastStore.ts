/**
 * The one place operation outcomes are announced. Import-free so `node --test`
 * can load it. One toast shows at a time; a newer outcome replaces the older one.
 */

export type ToastTone = "success" | "error" | "info";

/** `accessibilityLabel` names the action for screen readers when the label alone is vague ("Undo delete"). */
export type ToastAction = { label: string; accessibilityLabel?: string; onPress: () => void };

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

const sameContent = (a: ToastMessage, tone: ToastTone, title: string, description?: string) =>
  a.tone === tone && a.title === title && a.description === description;

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
  const durationMs = options.durationMs ?? DURATION[tone];

  // The same outcome reported again (a double tap, or two layers catching one
  // error) keeps the visible toast and restarts its timer instead of flashing.
  if (current && sameContent(current, tone, title, options.description)) {
    current = { ...current, ...options, durationMs };
    emit();
    return current.id;
  }

  const id = nextId++;
  current = { id, tone, title, ...options, durationMs };
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

/*
 * Where toasts sit. Bottom by default; a screen whose key actions live at the
 * bottom (the web login card: Forgotten password, Create an account) asks for
 * the top while it is mounted, so a failure toast never covers the way out.
 */

export type ToastPlacement = "top" | "bottom";

let placement: ToastPlacement = "bottom";
const placementListeners = new Set<(placement: ToastPlacement) => void>();

export const setToastPlacement = (next: ToastPlacement): void => {
  placement = next;
  placementListeners.forEach((listener) => listener(next));
};

export const subscribeToToastPlacement = (
  listener: (placement: ToastPlacement) => void
): (() => void) => {
  placementListeners.add(listener);
  listener(placement);
  return () => {
    placementListeners.delete(listener);
  };
};

/*
 * Toast layers. A modal or sheet draws above the app root (a separate window on
 * Android and iOS, a body-level portal on web), so a toast drawn at the root is
 * hidden while one is open. Each modal therefore hosts its own viewport, and
 * only the most recently opened one draws the toast.
 */

type LayerListener = (topLayer: number | null) => void;

const layers: number[] = [];
let nextLayer = 1;
const layerListeners = new Set<LayerListener>();

const topLayer = (): number | null => layers[layers.length - 1] ?? null;

const emitLayers = () => layerListeners.forEach((listener) => listener(topLayer()));

export const registerToastLayer = (): { id: number; unregister: () => void } => {
  const id = nextLayer++;
  layers.push(id);
  emitLayers();
  return {
    id,
    unregister: () => {
      const index = layers.indexOf(id);
      if (index === -1) return;
      layers.splice(index, 1);
      emitLayers();
    },
  };
};

export const subscribeToTopToastLayer = (listener: LayerListener): (() => void) => {
  layerListeners.add(listener);
  listener(topLayer());
  return () => {
    layerListeners.delete(listener);
  };
};
