import type { HelpCategory } from "../../types/helpCenter.types";

export const NOTIFICATIONS_CATEGORY: HelpCategory = {
  id: "notifications",
  title: "Notifications",
  description:
    "Learn about appointment reminders, account updates, approvals, and other MaslogCare notifications.",
  icon: "bell",
  tone: "purple",
  articles: [
    {
      id: "appointment-approval-notice",
      title: "Appointment approval notices",
      summary: "You are notified once staff approve or decline your appointment request.",
      keywords: ["approval", "approved", "declined", "notice"],
    },
    {
      id: "appointment-reminders",
      title: "Appointment reminders",
      summary: "Reminders are sent before an upcoming consultation so you can prepare.",
      keywords: ["reminder", "upcoming", "alert"],
    },
    {
      id: "reschedule-updates",
      title: "Reschedule updates",
      summary: "Any change to your appointment date or time is sent as a notification.",
      keywords: ["reschedule", "moved", "changed"],
    },
    {
      id: "cancellation-updates",
      title: "Cancellation updates",
      summary: "Cancellations made by you or by staff are confirmed through a notification.",
      keywords: ["cancel", "cancelled", "called off"],
    },
    {
      id: "account-approval-notice",
      title: "Account approval and rejection",
      summary: "Registration decisions are announced through a notification and by email.",
      keywords: ["account", "approval", "rejected", "registration"],
    },
    {
      id: "security-updates",
      title: "Security and password updates",
      summary: "Password changes and security-related account activity generate a notification.",
      keywords: ["security", "password", "suspicious", "login"],
    },
    {
      id: "missing-notifications",
      title: "Missing notifications",
      summary:
        "Open the Notifications page to see everything on record, even if the device alert did not appear.",
      keywords: ["missing", "not receiving", "no notification"],
    },
    {
      id: "push-troubleshooting",
      title: "Push notification troubleshooting",
      summary:
        "Allow notification permission for MaslogCare in your device settings and keep the app updated.",
      keywords: ["push", "permission", "troubleshoot", "not working", "android"],
    },
  ],
};
