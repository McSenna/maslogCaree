import type { HelpCategory } from "../../types/helpCenter.types";

export const APPOINTMENTS_CATEGORY: HelpCategory = {
  id: "appointments",
  title: "Appointments",
  description:
    "Learn how to book, reschedule, cancel, track, and manage your healthcare appointments.",
  icon: "calendar",
  tone: "primary",
  articles: [
    {
      id: "book-appointment",
      title: "Booking an appointment",
      summary:
        "Choose a service, pick an open date and time, then book. Your appointment is confirmed right away. For immunization, enter your child's name and date of birth and pick a Wednesday; the time is assigned first come, first served.",
      keywords: ["book", "booking", "schedule", "slot", "consultation", "immunization", "vaccine", "child", "wednesday"],
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
        "Open the appointment, choose Reschedule, then select a new open time. The new time is confirmed right away. An immunization moves to another Wednesday and gets that day's first open time.",
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
        "Confirmed means your time is booked. Rescheduled means it moved to a new time. Pending means the health team changed that mission day and your visit is waiting for a new time. Processing means you are being attended to, Completed is finished, Declined means the health team could not take the visit, and Cancelled was called off.",
      keywords: ["status", "pending", "confirmed", "approved", "processing", "completed", "declined", "cancelled", "rescheduled"],
    },
  ],
};
