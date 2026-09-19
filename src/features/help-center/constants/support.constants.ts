import type { SupportCategoryId, SupportStatus } from "../types/support.types";

export const SUPPORT_CATEGORIES: readonly { id: SupportCategoryId; label: string }[] = [
  { id: "account_registration", label: "Account & Registration" },
  { id: "email_otp_verification", label: "Email / OTP Verification" },
  { id: "account_approval", label: "Account Approval" },
  { id: "appointment_concern", label: "Appointment Concern" },
  { id: "reschedule_issue", label: "Reschedule Issue" },
  { id: "appointment_cancellation", label: "Appointment Cancellation" },
  { id: "medical_information", label: "Medical Information Concern" },
  { id: "notification_issue", label: "Notification Issue" },
  { id: "incorrect_personal_information", label: "Incorrect Personal Information" },
  { id: "technical_problem", label: "Technical / Application Problem" },
  { id: "privacy_security", label: "Privacy or Security Concern" },
  { id: "other", label: "Other Concern" },
];

export const SUPPORT_STATUS_ORDER: readonly SupportStatus[] = [
  "open",
  "in_review",
  "awaiting_user",
  "resolved",
  "closed",
];

export const SUPPORT_STATUS_LABELS: Record<SupportStatus, string> = {
  open: "Open",
  in_review: "In Review",
  awaiting_user: "Awaiting Your Response",
  resolved: "Resolved",
  closed: "Closed",
};

export const SUPPORT_LIMITS = {
  subjectMin: 5,
  subjectMax: 120,
  descriptionMin: 20,
  descriptionMax: 2000,
  messageMax: 2000,
  maxAttachments: 3,
  maxAttachmentBytes: 5 * 1024 * 1024,
  allowedMimes: ["image/jpeg", "image/png", "application/pdf"] as const,
  allowedExtensions: ["jpg", "jpeg", "png", "pdf"] as const,
} as const;

export const SUPPORT_PLACEHOLDERS = {
  subject: "Example: Unable to reschedule my appointment",
  description:
    "Please describe what happened, what you expected to happen, and any error message you received.",
  search: "Search appointments, accounts, notifications, medical information...",
} as const;
