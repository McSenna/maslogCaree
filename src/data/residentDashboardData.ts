import type { HealthService, HealthTip, QuickAction } from "@/types/residentDashboard";

export const quickActions: QuickAction[] = [
  {
    id: "book",
    label: "Book Appointment",
    shortLabel: "Book",
    icon: "calendar-outline",
    tone: "blue",
    href: "/resident/appointments",
  },
  {
    id: "records",
    label: "View Health Records",
    shortLabel: "Records",
    icon: "document-text-outline",
    tone: "green",
    href: "/resident/records",
  },
  {
    id: "services",
    label: "Browse Services",
    shortLabel: "Services",
    icon: "medkit-outline",
    tone: "purple",
    href: "/resident/services",
  },
  {
    id: "announcements",
    label: "Announcements",
    shortLabel: "Announcements",
    icon: "megaphone-outline",
    tone: "orange",
    href: "/resident/announcements",
  },
];

export const healthServices: HealthService[] = [
  {
    id: "svc-001",
    title: "General Check-up",
    description: "Routine health assessment for all ages.",
    icon: "medkit-outline",
    tone: "blue",
  },
  {
    id: "svc-002",
    title: "Vaccination",
    description: "Immunization for a healthier community.",
    icon: "medical-outline",
    tone: "green",
  },
  {
    id: "svc-003",
    title: "Maternal and Child Health",
    description: "Care for mothers and children.",
    icon: "heart",
    tone: "pink",
  },
];

export const healthTip: HealthTip = {
  headline: "Regular check-ups lead to a healthier tomorrow.",
  ctaLabel: "Learn More",
};

export const bannerQuote = {
  line1: "“A healthier you",
  line2: "A stronger Maslog.”",
};

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
