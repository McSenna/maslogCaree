import { View } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";
import { LOG_COLUMNS } from "./logsTableColumns";
import { useSystemLogsPalette } from "./systemLogsTheme";

/**
 * Placeholder for the desktop logs table.
 *
 * Bare, and built on the same column weights and row height as LogsTable, so it
 * occupies exactly the space the real table will and the card it sits in does
 * not resize when the data lands.
 */
export function LogsTableSkeleton({ rows = 8 }: { rows?: number }) {
  const palette = useSystemLogsPalette();

  const columns = [
    LOG_COLUMNS.timestamp,
    LOG_COLUMNS.user,
    LOG_COLUMNS.role,
    LOG_COLUMNS.action,
    LOG_COLUMNS.module,
    LOG_COLUMNS.severity,
    LOG_COLUMNS.ip,
    LOG_COLUMNS.status,
  ];

  return (
    <View className="w-full" accessibilityLabel="Loading system logs">
      <View
        className="w-full flex-row items-center"
        style={{ height: 44, borderBottomWidth: 1, borderBottomColor: palette.divider }}
      >
        <View className="px-3" style={{ width: LOG_COLUMNS.checkbox }}>
          <Skeleton className="h-[18px] w-[18px] rounded" />
        </View>
        {columns.map((flex, i) => (
          <View key={i} className="px-3" style={{ flex, minWidth: 0 }}>
            <Skeleton className="h-2.5 w-3/5 rounded" />
          </View>
        ))}
      </View>

      {Array.from({ length: rows }).map((_, row) => (
        <View
          key={row}
          className="w-full flex-row items-center"
          style={{
            minHeight: 68,
            borderBottomWidth: row === rows - 1 ? 0 : 1,
            borderBottomColor: palette.divider,
          }}
        >
          <View className="px-3" style={{ width: LOG_COLUMNS.checkbox }}>
            <Skeleton className="h-[18px] w-[18px] rounded" />
          </View>
          {columns.map((flex, i) => (
            <View key={i} className="px-3" style={{ flex, minWidth: 0 }}>
              <Skeleton className="h-3 w-4/5 rounded" />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export function MobileLogCardSkeleton({ count = 5 }: { count?: number }) {
  const palette = useSystemLogsPalette();

  return (
    <View className="w-full gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          className="flex-row items-center gap-3 rounded-2xl border p-3.5"
          style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}
        >
          <Skeleton className="h-9 w-9 rounded-xl" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-3.5 w-2/3 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
            <Skeleton className="h-3 w-1/3 rounded" />
          </View>
        </View>
      ))}
    </View>
  );
}
