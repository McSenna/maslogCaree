import { Text } from "react-native";

import { TableLink, TableText, type Column } from "@/components/data-table";
import { TABLE_TEXT } from "@/components/data-table/tableTokens";
import RoleBadge from "@/features/users/components/RoleBadge";
import {
  formatSystemLogActionLabel,
  formatSystemLogDate,
  normalizeRoleLabel,
  type SystemLog,
} from "@/features/systemLogs/services/systemLogService";
import { useThemeColors } from "@/hooks/useThemeColors";

import SeverityIndicator from "./SeverityIndicator";
import StatusBadge from "./StatusBadge";

type Handlers = {
  onOpen: (log: SystemLog) => void;
};

const IpAddress = ({ value }: { value: string }) => {
  const colors = useThemeColors();
  return (
    <Text numberOfLines={1} style={[TABLE_TEXT.cell, { color: colors.body, fontFamily: "monospace" }]}>
      {value}
    </Text>
  );
};

/** System logs, declared once for the header, rows, skeleton and phone cards. */
export const logColumns = ({ onOpen }: Handlers): Column<SystemLog>[] => [
  { key: "timestamp", header: "Timestamp", align: "center", width: 156, render: (log) => <TableText value={formatSystemLogDate(log.createdAt)} lines={2} /> },
  {
    key: "user", nameColumn: true,
    header: "User",
    flex: 1.4,
    minWidth: 140,
    render: (log) => (
      <TableLink
        label={log.userName}
        accessibilityLabel={`${formatSystemLogActionLabel(log)} by ${log.userName} at ${formatSystemLogDate(log.createdAt)}`}
        accessibilityHint="Shows the log details"
        onPress={() => onOpen(log)}
      />
    ),
  },
  {
    key: "role",
    header: "Role",
    align: "center",
    width: 146,
    // Beside the details panel the table is narrow; the role is also in the panel and on the card.
    hideBelow: "lg",
    cardRole: "badge",
    render: (log) =>
      log.role && log.role !== "unknown" ? <RoleBadge role={log.role} size="sm" /> : <TableText value={normalizeRoleLabel(log.role)} tone="muted" />,
  },
  {
    key: "action",
    header: "Action",
    flex: 1.8,
    minWidth: 150,
    render: (log) => <TableText value={formatSystemLogActionLabel(log)} tone="heading" lines={2} />,
  },
  { key: "module", header: "Module", align: "center", width: 146, hideBelow: "lg", accessor: (log) => log.module },
  { key: "severity", header: "Severity", align: "center", width: 134, hideBelow: "md", render: (log) => <SeverityIndicator severity={log.severity} /> },
  { key: "ip", header: "IP address", align: "center", width: 156, hideBelow: "lg", render: (log) => <IpAddress value={log.ipAddress} /> },
  { key: "status", header: "Status", align: "center", width: 134, cardRole: "badge", render: (log) => <StatusBadge status={log.status} /> },
];
