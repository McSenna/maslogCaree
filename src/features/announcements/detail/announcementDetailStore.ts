/**
 * Which announcement the root-level detail dialog is showing. Import-free so
 * `node --test` can load it. A notification opens the dialog from anywhere
 * (inbox page, header panel, dashboard) without each screen mounting its own.
 */

/** What the notification itself said, shown while loading or if the post is gone. */
export type AnnouncementDetailPreview = {
  title: string;
  body: string;
};

export type AnnouncementDetailRequest = {
  key: number;
  /** Null for alerts written before notifications carried the link. */
  announcementId: string | null;
  preview: AnnouncementDetailPreview | null;
};

type Listener = (request: AnnouncementDetailRequest | null) => void;

let current: AnnouncementDetailRequest | null = null;
let nextKey = 1;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener(current));

export const subscribeToAnnouncementDetail = (listener: Listener): (() => void) => {
  listeners.add(listener);
  listener(current);
  return () => {
    listeners.delete(listener);
  };
};

const cleanId = (id: string | null | undefined): string | null =>
  typeof id === "string" && id.trim() ? id.trim() : null;

/** Opening again replaces what is showing; the new key remounts the dialog with fresh state. */
export const openAnnouncementDetail = (
  announcementId: string | null | undefined,
  preview: AnnouncementDetailPreview | null = null
): number => {
  current = { key: nextKey++, announcementId: cleanId(announcementId), preview };
  emit();
  return current.key;
};

/** With a key, closes only that request, so a late close cannot dismiss a newer one. */
export const closeAnnouncementDetail = (key?: number): void => {
  if (!current || (key !== undefined && current.key !== key)) return;
  current = null;
  emit();
};
