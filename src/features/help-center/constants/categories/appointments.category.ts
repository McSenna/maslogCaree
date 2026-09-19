import type { HelpCategory } from "../../types/helpCenter.types";

export const APPOINTMENTS_CATEGORY: HelpCategory = {
  id: "appointments",
  title: "Appointments",
  description:
    "Learn how to book, reschedule, cancel, track, and manage your healthcare appointments.",
  icon: "calendar",
  tone: "blue",
  articles: [
    {
      id: "book-appointment",
      title: "Booking an appointment",
      summary:
        "Choose a service, pick an available date and time slot, then confirm your booking request.",
      keywords: ["book", "booking", "schedule", "slot", "consultation"],
    },
    {
      id: "view-appointments",
      title: "Viewing your appointments",
      summary: "Upcoming and past appointments are listed under My Appointments.",
      keywords: ["view", "list", "upcoming", "history"],
    },
    {
      id: "reschedule-appointment",
      title: "Rescheduling an appointment",
      summary:
        "Open the appointment, choose Reschedule, then select a new available slot. Approved appointments may need staff confirmation.",
      keywords: ["reschedule", "move", "change date", "rebook"],
    },
    {
      id: "cancel-appointment",
      title: "Cancelling an appointment",
      summary:
        "Open the appointment and choose Cancel. Cancelling frees the slot for other residents.",
      keywords: ["cancel", "cancellation", "remove"],
    },
    {
      id: "qr-check-in",
      title: "QR check-in at the health center",
      summary: "Present your appointment QR code so health center staff can check you in.",
      keywords: ["qr", "check in", "checkin", "scan", "queue"],
    },
    {
      id: "appointment-availability",
      title: "Appointment availability",
      summary:
        "Slots depend on office hours, staff availability, and the daily appointment limit set by the administrator.",
      keywords: ["availability", "slots", "full", "limit", "office hours"],
    },
    {
      id: "appointment-status",
      title: "Appointment status explained",
      summary:
        "Pending awaits review, Approved is confirmed, Processing means you are being attended to, Completed is finished, Cancelled was called off, and Rescheduled moved to a new slot.",
      keywords: ["status", "pending", "approved", "processing", "completed", "cancelled", "rescheduled"],
    },
  ],
};
