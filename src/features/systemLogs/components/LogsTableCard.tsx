import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import Pagination from "@/components/ui/Pagination";
import { CARD_SHADOW, RADIUS } from "@/design/adminSurfaces";
import type { SystemLog } from "../services/systemLogService";
import { PAGE_SIZE } from "../constants/logsLayout";
import LogsTable from "./LogsTable";
import { LOGS_TABLE_MIN_WIDTH } from "./logsTableColumns";
import { LogsTableSkeleton } from "./LogsSkeleton";
import { useSystemLogsPalette } from "./systemLogsTheme";

type LogsTableCardProps = {
  logs: SystemLog[];
  loading: boolean;
  refreshing: boolean;
  fallback: ReactNode;
  showFallback: boolean;
  selectedId: string | null;
  onSelect: (log: SystemLog) => void;
  tableAreaWidth: number;
  onTableAreaWidth: (width: number) => void;
  showPagination: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

const LogsTableCard = ({
  logs,
  loading,
  refreshing,
  fallback,
  showFallback,
  selectedId,
  onSelect,
  tableAreaWidth,
  onTableAreaWidth,
  showPagination,
  page,
  totalPages,
  total,
  onPageChange,
}: LogsTableCardProps) => {
  const palette = useSystemLogsPalette();

  return (
    <View
      className="w-full overflow-hidden border"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      {loading && !refreshing ? (
        <LogsTableSkeleton rows={PAGE_SIZE} />
      ) : showFallback ? (
        fallback
      ) : (
        <View
          className="w-full"
          onLayout={(event) => {
            const next = Math.round(event.nativeEvent.layout.width);
            if (next > 0 && next !== tableAreaWidth) onTableAreaWidth(next);
          }}
        >
          {/* Show the scrollbar only when columns overflow, so clipped columns are discoverable. */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={tableAreaWidth > 0 && tableAreaWidth < LOGS_TABLE_MIN_WIDTH}
          >
            <View style={{ width: Math.max(tableAreaWidth, LOGS_TABLE_MIN_WIDTH) }}>
              <LogsTable logs={logs} selectedId={selectedId} onSelect={onSelect} />
            </View>
          </ScrollView>
        </View>
      )}

      {showPagination ? (
        <View className="w-full p-4" style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            isDesktop
            noun="logs"
            onPageChange={onPageChange}
          />
        </View>
      ) : null}
    </View>
  );
};

export default LogsTableCard;
