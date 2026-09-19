import type { HelpFaq } from "../types/helpCenter.types";

export const HELP_FAQS: readonly HelpFaq[] = [
  {
    id: "faq-pending-account",
    question: "Why is my MaslogCare account still pending?",
    answer:
      "Resident accounts stay pending until an administrator reviews your registration details and valid ID. You will receive a notification once the review is complete.",
    keywords: ["pending", "account", "approval", "waiting"],
  },
  {
    id: "faq-no-otp",
    question: "Why didn't I receive my OTP?",
    answer:
      "Check your spam or promotions folder and confirm the email address you registered with. Codes expire after a short time, so request a new one if it has lapsed.",
    keywords: ["otp", "code", "email", "verification", "resend"],
  },
  {
    id: "faq-reschedule",
    question: "How do I reschedule my appointment?",
    answer:
      "Open My Appointments, select the appointment, then choose Reschedule and pick a new available slot. Health center staff confirm the new schedule.",
    keywords: ["reschedule", "move", "change", "appointment"],
  },
  {
    id: "faq-cancel",
    question: "How do I cancel my appointment?",
    answer:
      "Open the appointment from My Appointments and choose Cancel. Cancelling releases the slot so another resident can book it.",
    keywords: ["cancel", "cancellation", "appointment"],
  },
  {
    id: "faq-status",
    question: "Where can I view my appointment status?",
    answer:
      "Every appointment card shows its current status: Pending, Approved, Processing, Completed, Cancelled, or Rescheduled.",
    keywords: ["status", "appointment", "pending", "approved"],
  },
  {
    id: "faq-medical-missing",
    question: "Why can't I see my medical information?",
    answer:
      "Medical information appears only after a health worker completes and saves the record for a finished consultation. Contact support if a completed visit stays empty.",
    keywords: ["medical", "missing", "records", "empty"],
  },
  {
    id: "faq-valid-ids",
    question: "What IDs can I use during registration?",
    answer:
      "Any government-issued ID is accepted, including PhilSys, driver's licence, passport, UMID, postal ID, and similar documents in JPG, PNG, or PDF format.",
    keywords: ["id", "valid id", "registration", "document"],
  },
  {
    id: "faq-correct-info",
    question: "How do I correct my personal information?",
    answer:
      "Update what you can from My Profile. For verified details, send a support request under Incorrect Personal Information so staff can make the correction.",
    keywords: ["correct", "personal information", "update", "profile"],
  },
  {
    id: "faq-no-notifications",
    question: "Why am I not receiving notifications?",
    answer:
      "Allow notification permission for MaslogCare in your device settings. Everything on record is still listed on the Notifications page.",
    keywords: ["notification", "push", "not receiving", "permission"],
  },
  {
    id: "faq-forgot-password",
    question: "What should I do if I forgot my password?",
    answer:
      "Choose Forgot Password on the login screen, enter your registered email, then use the recovery code sent to you to set a new password.",
    keywords: ["forgot", "password", "reset", "recovery"],
  },
  {
    id: "faq-contact-support",
    question: "How do I contact MaslogCare support?",
    answer:
      "Use Contact Support on this page to send a support request. You can follow its progress under My Support Requests.",
    keywords: ["contact", "support", "help", "request"],
  },
];
