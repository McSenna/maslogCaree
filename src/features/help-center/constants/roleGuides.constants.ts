import type { RoleGuide } from "../types/helpCenter.types";

export const ROLE_GUIDES: readonly RoleGuide[] = [
  {
    role: "resident",
    title: "Using MaslogCare as a Resident",
    description: "Manage your profile, appointments, and health information.",
    icon: "user",
    topics: [
      "Keeping your profile up to date",
      "Booking an appointment",
      "Rescheduling an appointment",
      "Cancelling an appointment",
      "Viewing your medical information",
      "Reading your notifications",
      "Sending a support request",
    ],
  },
  {
    role: "bhw",
    title: "Using MaslogCare as a BHW",
    description: "Monitor residents and support the health center queue.",
    icon: "users",
    topics: [
      "Monitoring residents in your barangay",
      "Viewing permitted resident information",
      "Monitoring appointments",
      "Working with the queue",
      "Reading your notifications",
    ],
  },
  {
    role: "midwife",
    title: "Using MaslogCare as a Midwife",
    description: "Handle patient information and daily healthcare workflows.",
    icon: "heart",
    topics: [
      "Viewing patient information",
      "Monitoring appointments",
      "Following healthcare workflows",
      "Reading your notifications",
    ],
  },
  {
    role: "doctor",
    title: "Using MaslogCare as a Doctor",
    description: "Work through assigned appointments and complete consultations.",
    icon: "clipboard",
    topics: [
      "Reviewing assigned appointments",
      "Viewing patient information",
      "Working through the queue",
      "Processing an appointment",
      "Completing an appointment record",
    ],
  },
  {
    role: "admin",
    title: "Using MaslogCare as an Administrator",
    description: "Administer accounts, services, and system settings.",
    icon: "settings",
    topics: [
      "Approving resident accounts",
      "Verifying submitted identity documents",
      "Managing users and staff",
      "Configuring services and office hours",
      "Setting appointment limits",
      "Reviewing reports and system logs",
      "Managing notifications and settings",
      "Managing support tickets",
    ],
  },
];

export const findRoleGuide = (role?: string | null): RoleGuide | undefined =>
  ROLE_GUIDES.find((guide) => guide.role === role);
