/**
 * Which legal document the root-level web dialog is showing. Import-free so
 * `node --test` can load it. Any screen can open the privacy policy or the terms
 * over what it is showing, without each screen mounting its own dialog.
 */

export type LegalDocumentKind = "privacy" | "terms";

type Listener = (kind: LegalDocumentKind | null) => void;

let current: LegalDocumentKind | null = null;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener(current));

export const subscribeToLegalDocument = (listener: Listener): (() => void) => {
  listeners.add(listener);
  listener(current);
  return () => {
    listeners.delete(listener);
  };
};

/** Opening the other document while one is showing swaps it in place. */
export const openLegalDocumentDialog = (kind: LegalDocumentKind): void => {
  if (current === kind) return;
  current = kind;
  emit();
};

export const closeLegalDocumentDialog = (): void => {
  if (current === null) return;
  current = null;
  emit();
};
