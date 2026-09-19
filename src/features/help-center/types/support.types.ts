export type SupportCategoryId =
  | "account_registration"
  | "email_otp_verification"
  | "account_approval"
  | "appointment_concern"
  | "reschedule_issue"
  | "appointment_cancellation"
  | "medical_information"
  | "notification_issue"
  | "incorrect_personal_information"
  | "technical_problem"
  | "privacy_security"
  | "other";

export type SupportStatus = "open" | "in_review" | "awaiting_user" | "resolved" | "closed";

export type SupportAttachmentDraft = {
  id: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  data: string;
};

export type SupportAttachment = {
  id: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
};

export type SupportMessage = {
  id: string;
  body: string;
  authorName: string;
  authorRole: string;
  isStaffReply: boolean;
  createdAt: string | null;
};

export type SupportTicketSummary = {
  id: string;
  ticketNumber: string;
  subject: string;
  category: SupportCategoryId;
  status: SupportStatus;
  requesterName: string;
  createdAt: string | null;
  updatedAt: string | null;
  lastActivityAt: string | null;
};

export type SupportTicket = SupportTicketSummary & {
  description: string;
  contactEmail: string;
  contactNumber: string;
  requesterRole: string;
  resolvedAt: string | null;
  closedAt: string | null;
  attachments: SupportAttachment[];
  messages: SupportMessage[];
};

export type SupportTicketPage = {
  tickets: SupportTicketSummary[];
  total: number;
  page: number;
  hasMore: boolean;
  statusCounts?: Partial<Record<SupportStatus, number>>;
};

export type SupportFormValues = {
  fullName: string;
  contactEmail: string;
  contactNumber: string;
  category: SupportCategoryId | "";
  subject: string;
  description: string;
};

export type SupportFormErrors = Partial<Record<keyof SupportFormValues | "attachments", string>>;

export type SupportContactInfo = {
  name: string;
  location: string;
  contactNumber: string;
  email: string;
  officeHours: { days: string; hours: string }[];
  responseTime: string;
};
