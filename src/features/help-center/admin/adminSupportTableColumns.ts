export const SUPPORT_TABLE_COLUMNS = {
  ticket: { width: 144, minWidth: 130 },
  requester: { flex: 1.5, minWidth: 200 },
  subject: { flex: 2, minWidth: 220 },
  category: { width: 192, minWidth: 180 },
  submitted: { width: 128, minWidth: 120 },
  updated: { width: 128, minWidth: 120 },
  status: { width: 136, minWidth: 128 },
  actions: { width: 112, minWidth: 104 },
} as const;

export const SUPPORT_TABLE_MIN_WIDTH = 1220;

export const SUPPORT_TABLE_HEADERS = [
  { key: "ticket", label: "Ticket ID", width: SUPPORT_TABLE_COLUMNS.ticket.width, minWidth: SUPPORT_TABLE_COLUMNS.ticket.minWidth },
  { key: "requester", label: "Requester / Resident", flex: SUPPORT_TABLE_COLUMNS.requester.flex, minWidth: SUPPORT_TABLE_COLUMNS.requester.minWidth },
  { key: "subject", label: "Subject & Details", flex: SUPPORT_TABLE_COLUMNS.subject.flex, minWidth: SUPPORT_TABLE_COLUMNS.subject.minWidth },
  { key: "category", label: "Concern Category", width: SUPPORT_TABLE_COLUMNS.category.width, minWidth: SUPPORT_TABLE_COLUMNS.category.minWidth },
  { key: "submitted", label: "Submitted", width: SUPPORT_TABLE_COLUMNS.submitted.width, minWidth: SUPPORT_TABLE_COLUMNS.submitted.minWidth },
  { key: "updated", label: "Last Updated", width: SUPPORT_TABLE_COLUMNS.updated.width, minWidth: SUPPORT_TABLE_COLUMNS.updated.minWidth },
  { key: "status", label: "Status", width: SUPPORT_TABLE_COLUMNS.status.width, minWidth: SUPPORT_TABLE_COLUMNS.status.minWidth, align: "center" as const },
  { key: "actions", label: "Action", width: SUPPORT_TABLE_COLUMNS.actions.width, minWidth: SUPPORT_TABLE_COLUMNS.actions.minWidth, align: "right" as const },
] as const;
