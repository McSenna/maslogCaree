export type DialogActionStyle = "default" | "cancel" | "destructive";

export type DialogAction = {
  text: string;
  style?: DialogActionStyle;
  onPress?: () => void;
};

export type ActionDialogRequest = {
  id: number;
  title: string;
  message?: string;
  actions: DialogAction[];
};

type Listener = (request: ActionDialogRequest | null) => void;

let current: ActionDialogRequest | null = null;
let nextId = 1;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener(current));

export const subscribeToActionDialog = (listener: Listener): (() => void) => {
  listeners.add(listener);
  listener(current);
  return () => {
    listeners.delete(listener);
  };
};

export const openActionDialog = (title: string, message: string | undefined, actions: DialogAction[]): void => {
  current = { id: nextId++, title, message, actions };
  emit();
};

export const closeActionDialog = (id: number): void => {
  if (current?.id !== id) return;
  current = null;
  emit();
};
