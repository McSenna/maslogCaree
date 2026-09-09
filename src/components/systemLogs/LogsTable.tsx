import { useState } from "react";
import { Text, View } from "react-native";
import Checkbox from "@/components/users/Checkbox";
import type { SystemLog } from "@/services/systemLogService";
import LogsTableRow from "./LogsTableRow";
import { LOG_COLUMNS } from "./logsTableColumns";
import { useSystemLogsPalette } from "./systemLogsTheme";

const HEADERS: { label: string; flex: number }[] = [
  { label: "Timestamp", flex: LOG_COLUMNS.timestamp },
  { label: "User", flex: LOG_COLUMNS.user },
  { label: "Role", flex: LOG_COLUMNS.role },
  { label: "Action", flex: LOG_COLUMNS.action },
  { label: "Module", flex: LOG_COLUMNS.module },
  { label: "Severity", flex: LOG_COLUMNS.severity },
  { label: "IP Address", flex: LOG_COLUMNS.ip },
  { label: "Status", flex: LOG_COLUMNS.status },
];

type LogsTableProps = {
  logs: SystemLog[];
  selectedId: string | null;
  onSelect: (log: SystemLog) => void;
};

/**
 * Desktop System Logs table.
 *
 * Deliberately a bare table, not a card: the page wraps it in the same white
 * container User Management uses, with the pagination as that container's
 * footer, so the two admin tables are one design rather than two lookalikes.
 */
export default function LogsTable({ logs, selectedId, onSelect }: LogsTableProps) {
  const palette = useSystemLogsPalette();
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const checkedOnPage = logs.filter((log) => checkedIds.has(log._id)).length;
  const allChecked = logs.length > 0 && checkedOnPage === logs.length;
  const someChecked = checkedOnPage > 0 && !allChecked;

  const toggleAll = () => {
    setCheckedIds(allChecked ? new Set() : new Set(logs.map((log) => log._id)));
  };

  const toggleOne = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <View className="w-full" accessibilityLabel="System logs table">
      {/* Header — deliberately light: a dark strip would fight the summary
          cards for attention on a page that is mostly table. */}
      <View
        className="w-full flex-row items-center"
        style={{
          height: 44,
          borderBottomWidth: 1,
          borderBottomColor: palette.divider,
        }}
      >
        <View className="items-center justify-center px-3" style={{ width: LOG_COLUMNS.checkbox }}>
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked}
            onChange={toggleAll}
            accessibilityLabel="Select all log entries on this page"
          />
        </View>

        {HEADERS.map((col) => (
          <View key={col.label} className="justify-center px-3" style={{ flex: col.flex, minWidth: 0 }}>
            <Text className="text-[12px] font-semibold" numberOfLines={1} style={{ color: palette.muted }}>
              {col.label}
            </Text>
          </View>
        ))}
      </View>

      {logs.map((log, index) => (
        <LogsTableRow
          key={log._id}
          log={log}
          isSelected={selectedId === log._id}
          isChecked={checkedIds.has(log._id)}
          onSelect={() => onSelect(log)}
          onToggleCheck={() => toggleOne(log._id)}
          isLast={index === logs.length - 1}
        />
      ))}
    </View>
  );
}
