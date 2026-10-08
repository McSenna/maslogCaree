import { Badge, type BadgeTone, type FeatherName } from "@/components/data-table";

import type { SupportStatus } from "../types/support.types";
import { supportStatusLabel } from "../utils/support.utils";

const LOOK: Record<SupportStatus, { tone: BadgeTone; icon: FeatherName }> = {
  open: { tone: "info", icon: "inbox" },
  in_review: { tone: "warning", icon: "clock" },
  awaiting_user: { tone: "danger", icon: "message-circle" },
  resolved: { tone: "success", icon: "check-circle" },
  closed: { tone: "neutral", icon: "archive" },
};

/** Ticket status: colour, icon and word, so colour is never the only signal. */
const AdminTicketStatusBadge = ({ status }: { status: SupportStatus }) => {
  const look = LOOK[status] ?? LOOK.closed;
  return <Badge tone={look.tone} icon={look.icon} label={supportStatusLabel(status)} spokenAs="Status" />;
};

export default AdminTicketStatusBadge;
