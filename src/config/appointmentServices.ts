import type { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * The MaslogCare services a resident can book.
 *
 * The server's catalogue (`backend/config/consultationCategories.js`) is the
 * source of truth and is what the form loads; this list is the offline
 * fallback and the place every screen reads a service's display name from.
 * No component spells a service name out itself, so the approved wording —
 * "BP Checking", never "Blood Pressure Monitoring" — exists once.
 *
 * `id` is the stable key stored on the appointment and sent to the API; `label`
 * is the only string shown to a resident.
 */

export type ServiceTypeOption = {
  id: string;
  label: string;
  /** One quiet line under the field once the service is chosen. */
  description?: string;
  /**
   * The staff role that handles the service.
   *
   * Mirrors the server catalogue's `queueRole` so the offline fallback tells a
   * resident the same thing the live form does. The server remains the
   * authority — this is only what the form falls back to when it cannot reach
   * it, and it is never sent back to the API.
   */
  queueRole?: string;
};

export const SERVICE_TYPES: ServiceTypeOption[] = [
  {
    id: "general_checkup",
    queueRole: "doctor",
    label: "General Checkup",
    description: "General health assessment and routine checkup.",
  },
  {
    id: "prenatal",
    queueRole: "midwife",
    label: "Prenatal",
    description: "Maternal health check for expecting mothers.",
  },
  {
    id: "immunization",
    queueRole: "midwife",
    label: "Immunization",
    description: "Scheduled vaccination and immunization services.",
  },
  {
    id: "consultation",
    queueRole: "doctor",
    label: "Consultation",
    description: "Talk to a health worker about a specific concern.",
  },
  {
    id: "bp_checking",
    queueRole: "bhw",
    label: "BP Checking",
    description: "Blood pressure reading and monitoring.",
  },
];

/**
 * Display name for a service key.
 *
 * Falls back to the key itself rather than to invented prose, so an unknown
 * service is visibly a data problem instead of quietly reading as a real one.
 */
export function getServiceLabel(
  id: string | null | undefined,
  options: ServiceTypeOption[] = SERVICE_TYPES
): string {
  if (!id) return "";
  return options.find((option) => option.id === id)?.label ?? id;
}

/** Icons used by the booking form, kept beside the catalogue they describe. */
export const APPOINTMENT_FIELD_ICONS: Record<
  "service" | "provider" | "reason" | "notes",
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  service: "stethoscope",
  provider: "account-outline",
  reason: "file-document-outline",
  notes: "note-text-outline",
};

/** How a provider's role reads under their name in the picker. */
export const PROVIDER_ROLE_LABELS: Record<string, string> = {
  doctor: "Doctor",
  midwife: "Midwife",
  bhw: "Barangay Health Worker",
  admin: "Admin",
};
