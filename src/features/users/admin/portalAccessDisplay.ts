/** The Portal access column's wording. Import-free so `node --test` can load it. */
import type { PortalState } from "./userAdmin.types.ts";

export type PortalTone = "success" | "danger" | "neutral";
export type PortalIcon = "monitor" | "globe" | "check-circle" | "slash" | "minus-circle" | "alert-circle";

export type PortalAccessLines = {
  line1: string;
  line2: string;
  tone: PortalTone;
  icon: PortalIcon;
  /** The line that carries the tone and icon. */
  toneLine: 1 | 2;
};

const LINES: Record<PortalState, PortalAccessLines> = {
  staff: { line1: "Web + mobile", line2: "", tone: "neutral", icon: "monitor", toneLine: 1 },
  global_blocked: { line1: "Blocked globally", line2: "Mobile only", tone: "danger", icon: "slash", toneLine: 1 },
  // That resident can sign in, so the exception must read as the one in effect.
  exception_allowed: { line1: "Blocked globally", line2: "Individual access enabled", tone: "success", icon: "check-circle", toneLine: 2 },
  global_allowed: { line1: "Web + mobile", line2: "Follows global setting", tone: "success", icon: "globe", toneLine: 1 },
  individual_allowed: { line1: "Web + mobile", line2: "Individual access enabled", tone: "success", icon: "check-circle", toneLine: 2 },
  individual_blocked: { line1: "Web blocked", line2: "Individually blocked", tone: "danger", icon: "slash", toneLine: 1 },
  ineligible: { line1: "No web access", line2: "Account not active", tone: "neutral", icon: "minus-circle", toneLine: 1 },
  unavailable: { line1: "Web access unavailable", line2: "Ask an admin to restore the setting", tone: "danger", icon: "alert-circle", toneLine: 1 },
};

export const portalAccessLines = (state: PortalState): PortalAccessLines => LINES[state];
