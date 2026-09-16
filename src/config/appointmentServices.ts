import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type ServiceTypeOption = {
  id: string;
  label: string;
  description?: string;
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

export const getServiceLabel = (
  id: string | null | undefined,
  options: ServiceTypeOption[] = SERVICE_TYPES
): string => {
  if (!id) return "";
  return options.find((option) => option.id === id)?.label ?? id;
};

export const APPOINTMENT_FIELD_ICONS: Record<
  "service" | "provider" | "reason" | "notes",
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  service: "stethoscope",
  provider: "account-outline",
  reason: "file-document-outline",
  notes: "note-text-outline",
};

export const PROVIDER_ROLE_LABELS: Record<string, string> = {
  doctor: "Doctor",
  midwife: "Midwife",
  bhw: "Barangay Health Worker",
  admin: "Admin",
};
