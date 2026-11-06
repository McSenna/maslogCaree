import { Platform } from "react-native";

/** DOM id of a row's View button. It carries the database id, never personal details. */
export const residentTriggerId = (recordId: string) => `resident-view-${recordId}`;

/**
 * Puts focus back on the row's View button once the details view has closed.
 * A mouse click on the row focuses nothing, so without this focus would land
 * on the page body. Runs after the dialog's own focus restore.
 */
export const focusResidentTrigger = (recordId: string) => {
  if (Platform.OS !== "web" || typeof document === "undefined") return;
  requestAnimationFrame(() => document.getElementById(residentTriggerId(recordId))?.focus());
};
