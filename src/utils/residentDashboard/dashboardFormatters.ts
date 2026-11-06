import { SERVICE_TYPES } from "@/config/appointmentServices";

export const formatConsultationTypeLabel = (key: string): string => {
  const known = SERVICE_TYPES.find((service) => service.id === key);
  if (known) return known.label;

  return String(key || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export { parseDate } from "./parseDate";
