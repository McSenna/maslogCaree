import { View } from "react-native";

import { TableCellRow, TableButton, TablePrimaryCell, TableText, type Column } from "@/components/data-table";
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
    <TableCellRow className="gap-3">
      <UserAvatar size={32} initials={initialsFrom(ticket.requesterName)} accessibilityLabel="" fallbackBackgroundColor={colors.primary} />
      <View className="min-w-0 shrink">
        <TablePrimaryCell title={ticket.requesterName} />
      </View>
    </TableCellRow>
  );
};

/** Support tickets, declared once for the header, rows, skeleton and phone cards. */
export const supportColumns = (onOpen: (ticketId: string) => void): Column<SupportTicketSummary>[] => [
  {
    key: "ticket",
    header: "Ticket ID",
    align: "center",
    width: 168,
    render: (ticket) => <TableText value={ticket.ticketNumber} weight="strong" tone="heading" selectable />,
  },
  { key: "requester", nameColumn: true, header: "Requester", flex: 1.5, minWidth: 200, cardRole: "title", render: (ticket) => <Requester ticket={ticket} /> },
  { key: "subject", header: "Subject", flex: 2, minWidth: 220, render: (ticket) => <TableText value={ticket.subject} tone="heading" /> },
  {
    key: "category",
    header: "Concern category",
    align: "center",
    width: 214,
    hideBelow: "lg",
    accessor: (ticket) => supportCategoryLabel(ticket.category),
  },
  { key: "submitted", header: "Submitted", align: "center", width: 146, accessor: (ticket) => formatTicketDate(ticket.createdAt) },
  {
    key: "updated",
    header: "Last updated",
    align: "center",
    width: 146,
    hideBelow: "md",
    accessor: (ticket) => formatTicketDate(ticket.lastActivityAt ?? ticket.updatedAt),
  },
  // Wide enough for the longest status, "Awaiting Your Response", without truncating.
  { key: "status", header: "Status", align: "center", width: 248, cardRole: "badge", render: (ticket) => <AdminTicketStatusBadge status={ticket.status} /> },
  {
    key: "actions",
    header: "Actions",
    align: "center",
    width: 120,
    render: (ticket) => (
      <TableButton icon="eye" label="Review" accessibilityLabel={`Review ticket ${ticket.ticketNumber}`} onPress={() => onOpen(ticket.id)} />
    ),
  },
];
