import { SERVICE_TYPES } from "@/config/appointmentServices";

export const getTimeGreeting = (date = new Date()): string => {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export const formatConsultationTypeLabel = (key: string): string => {
  const known = SERVICE_TYPES.find((service) => service.id === key);
  if (known) return known.label;

  return String(key || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const parseDate = (s?: string | null): Date | null => {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};
