import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Checkbox from "@/components/users/Checkbox";
import RoleBadge from "@/components/users/RoleBadge";
import {
  formatSystemLogActionLabel,
  formatSystemLogDate,
  normalizeRoleLabel,
  type SystemLog,
} from "@/services/systemLogService";
import SeverityIndicator from "./SeverityIndicator";
import StatusBadge from "./StatusBadge";
import { LOG_COLUMNS } from "./logsTableColumns";
import { useSystemLogsPalette } from "./systemLogsTheme";

type LogsTableRowProps = {
  log: SystemLog;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: () => void;
  onToggleCheck: () => void;
  /** The last row drops its divider so it cannot double up with the card edge. */
  isLast: boolean;
};

function Cell({
  children,
  flex,
  width,
  align = "flex-start",
}: {
  children: React.ReactNode;
  flex?: number;
  width?: number;
  align?: "flex-start" | "center";
}) {
  return (
    <View
      className="justify-center px-3"
      style={{ flex, width, minWidth: 0, alignItems: align === "center" ? "center" : undefined }}
    >
      {children}
    </View>
  );
}

export default function LogsTableRow({
  log,
  isSelected,
  isChecked,
  onSelect,
  onToggleCheck,
  isLast,
}: LogsTableRowProps) {
  const palette = useSystemLogsPalette();
  const [hovered, setHovered] = useState(false);

  const background = isSelected
    ? palette.rowSelected
    : hovered
      ? palette.subtleSurface
      : palette.cardBg;

  return (
    <Pressable
      onPress={onSelect}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityLabel={`${formatSystemLogActionLabel(log)} by ${log.userName} at ${formatSystemLogDate(log.createdAt)}`}
      accessibilityState={{ selected: isSelected }}
      className="w-full flex-row items-center"
      style={{
        minHeight: 68,
        backgroundColor: background,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <Cell width={LOG_COLUMNS.checkbox} align="center">
        <Checkbox
          checked={isChecked}
          onChange={onToggleCheck}
          accessibilityLabel={`Select log entry by ${log.userName}`}
        />
      </Cell>

      {/* Timestamp */}
      <Cell flex={LOG_COLUMNS.timestamp}>
        <Text className="text-[13px] font-medium" numberOfLines={2} style={{ color: palette.body }}>
          {formatSystemLogDate(log.createdAt)}
        </Text>
      </Cell>

      {/* User — the strongest text in the row, matching the User column opposite. */}
      <Cell flex={LOG_COLUMNS.user}>
        <Text className="text-[14px] font-bold" numberOfLines={1} style={{ color: palette.heading }}>
          {log.userName}
        </Text>
      </Cell>

      {/* Role */}
      <Cell flex={LOG_COLUMNS.role}>
        {log.role && log.role !== "unknown" ? (
          <RoleBadge role={log.role} size="sm" />
        ) : (
          <Text className="text-[13px] font-medium" style={{ color: palette.subtle }}>
            {normalizeRoleLabel(log.role)}
          </Text>
        )}
      </Cell>

      {/* Action */}
      <Cell flex={LOG_COLUMNS.action}>
        <Text className="text-[13px] font-medium" numberOfLines={2} style={{ color: palette.heading }}>
          {formatSystemLogActionLabel(log)}
        </Text>
      </Cell>

      {/* Module */}
      <Cell flex={LOG_COLUMNS.module}>
        <Text className="text-[13px] font-medium" numberOfLines={1} style={{ color: palette.body }}>
          {log.module}
        </Text>
      </Cell>

      {/* Severity */}
      <Cell flex={LOG_COLUMNS.severity}>
        <SeverityIndicator severity={log.severity} />
      </Cell>

      {/* IP Address — monospace keeps the octets aligned down the column. */}
      <Cell flex={LOG_COLUMNS.ip}>
        <Text
          className="text-[12.5px]"
          numberOfLines={1}
          style={{ color: palette.body, fontFamily: "monospace" }}
        >
          {log.ipAddress}
        </Text>
      </Cell>

      {/* Status */}
      <Cell flex={LOG_COLUMNS.status}>
        <StatusBadge status={log.status} />
      </Cell>
    </Pressable>
  );
}
