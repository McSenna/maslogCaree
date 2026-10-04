import type { QuickAction } from "@/types/residentDashboard";

export const quickActions: QuickAction[] = [
  {
    id: "book",
    label: "Book Appointment",
    shortLabel: "Book",
    icon: "calendar-outline",
    tone: "primary",
    href: "/resident/appointments",
  },
  {
    id: "records",
    label: "View Health Records",
    shortLabel: "Records",
    icon: "document-text-outline",
    tone: "care",
    href: "/resident/records",
  },
  {
    id: "services",
    label: "Browse Services",
    shortLabel: "Services",
    icon: "medkit-outline",
    tone: "neutral",
    href: "/resident/services",
  },
  {
    id: "announcements",
    label: "Announcements",
    shortLabel: "Announcements",
    icon: "megaphone-outline",
    tone: "accent",
    href: "/resident/announcements",
  },
];


export const formatAppointmentDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const splitAppointmentDate = (
  iso: string
): { month: string; day: string; year: string } => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return { month: "", day: "", year: "" };
  return {
    month: date.toLocaleDateString(undefined, { month: "short" }).toUpperCase(),
    day: String(date.getDate()).padStart(2, "0"),
    year: String(date.getFullYear()),
  };
};
