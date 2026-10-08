import { View } from "react-native";

import { TableButton, TablePrimaryCell, TableText, type Column } from "@/components/data-table";
import UserAvatar, { initialsFrom } from "@/components/ui/UserAvatar";
import { useThemeColors } from "@/hooks/useThemeColors";

import type { SupportTicketSummary } from "../types/support.types";
import { formatTicketDate, supportCategoryLabel } from "../utils/support.utils";
import AdminTicketStatusBadge from "./AdminTicketStatusBadge";

/**
 * Narrowest content width that fits the columns that never hide (ticket,
 * requester, subject, submitted, status, action). Below it the screen shows
 * the ticket card list instead of the table.
 */
export const SUPPORT_TABLE_MIN_WIDTH = 1040;

const Requester = ({ ticket }: { ticket: SupportTicketSummary }) => {
  const colors = useThemeColors();
  return (
    <View className="min-w-0 flex-row items-center gap-3 self-stretch">
      <UserAvatar size={32} initials={initialsFrom(ticket.requesterName)} accessibilityLabel="" fallbackBackgroundColor={colors.primary} />
      <View className="min-w-0 flex-1">
        <TablePrimaryCell title={ticket.requesterName} />
      </View>
    </View>
  );
};

/** Support tickets, declared once for the header, rows, skeleton and phone cards. */
export const supportColumns = (onOpen: (ticketId: string) => void): Column<SupportTicketSummary>[] => [
  {
    key: "ticket",
    header: "Ticket ID",
    width: 150,
    render: (ticket) => <TableText value={ticket.ticketNumber} weight="strong" tone="heading" selectable />,
  },
  { key: "requester", header: "Requester", flex: 1.5, minWidth: 200, cardRole: "title", render: (ticket) => <Requester ticket={ticket} /> },
  { key: "subject", header: "Subject", flex: 2, minWidth: 220, render: (ticket) => <TableText value={ticket.subject} tone="heading" /> },
  {
    key: "category",
    header: "Concern category",
    width: 190,
    hideBelow: "lg",
    accessor: (ticket) => supportCategoryLabel(ticket.category),
  },
  { key: "submitted", header: "Submitted", width: 130, accessor: (ticket) => formatTicketDate(ticket.createdAt) },
  {
    key: "updated",
    header: "Last updated",
    width: 130,
    hideBelow: "md",
    accessor: (ticket) => formatTicketDate(ticket.lastActivityAt ?? ticket.updatedAt),
  },
  // Wide enough for the longest status, "Awaiting Your Response", without truncating.
  { key: "status", header: "Status", width: 220, cardRole: "badge", render: (ticket) => <AdminTicketStatusBadge status={ticket.status} /> },
  {
    key: "actions",
    header: "Actions",
    width: 120,
    render: (ticket) => (
      <TableButton icon="eye" label="Review" accessibilityLabel={`Review ticket ${ticket.ticketNumber}`} onPress={() => onOpen(ticket.id)} />
    ),
  },
];
