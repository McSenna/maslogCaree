import type { BadgeTone, FeatherName } from "@/components/data-table";

import type { VaccinationStatus } from "./vaccinationTypes";

// Colour, icon and words together, never colour alone. "Draft" stays short because
// the date beside it already reads "Not administered".
export const STATUS_BADGES: Record<VaccinationStatus, { tone: BadgeTone; icon: FeatherName; label: string }> = {
  administered: { tone: "success", icon: "check-circle", label: "Administered" },
  deferred: { tone: "warning", icon: "clock", label: "Deferred" },
  review: { tone: "warning", icon: "alert-triangle", label: "Requires review" },
  voided: { tone: "neutral", icon: "x-circle", label: "Voided" },
  draft: { tone: "neutral", icon: "edit-2", label: "Draft" },
};
