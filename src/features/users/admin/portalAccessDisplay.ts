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

const ON = "Web access: ON";
const OFF = "Web access: OFF";

const LINES: Record<PortalState, PortalAccessLines> = {
  staff: { line1: "Web + mobile", line2: "", tone: "neutral", icon: "monitor", toneLine: 1 },
  global_blocked: { line1: OFF, line2: "Blocked globally", tone: "danger", icon: "slash", toneLine: 1 },
  exception_allowed: { line1: ON, line2: "Individual access enabled", tone: "success", icon: "check-circle", toneLine: 1 },
  global_allowed: { line1: ON, line2: "Follows global setting", tone: "success", icon: "globe", toneLine: 1 },
  individual_allowed: { line1: ON, line2: "Individual access enabled", tone: "success", icon: "check-circle", toneLine: 1 },
  individual_blocked: { line1: OFF, line2: "Individually blocked", tone: "danger", icon: "slash", toneLine: 1 },
  ineligible: { line1: OFF, line2: "Account not active", tone: "neutral", icon: "minus-circle", toneLine: 1 },
  unavailable: { line1: OFF, line2: "Setting unavailable", tone: "danger", icon: "alert-circle", toneLine: 1 },
};

export const portalAccessLines = (state: PortalState): PortalAccessLines => LINES[state];
