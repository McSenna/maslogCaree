import { View } from "react-native";
import type { ReactNode } from "react";
import LogDetailsPanel from "../components/LogDetailsPanel";
import LogsTableCard from "../components/LogsTableCard";
import type { SystemLog } from "../services/systemLogService";

const DesktopLogsView = ({
  logs,
  loading,
  refreshing,
  fallback,
  showFallback,
  selectedLog,
  onSelect,
  onClearSelection,
  tableAreaWidth,
  onTableAreaWidth,
  showPagination,
  page,
  totalPages,
  total,
  onPageChange,
}: {
  logs: SystemLog[];
  loading: boolean;
  refreshing: boolean;
  fallback: ReactNode;
  showFallback: boolean;
  selectedLog: SystemLog | null;
  onSelect: (log: SystemLog) => void;
  onClearSelection: () => void;
  tableAreaWidth: number;
  onTableAreaWidth: (width: number) => void;
  showPagination: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) => (
  <View className="w-full flex-row items-start gap-4">
    <View style={{ flex: 76, minWidth: 0 }}>
      <LogsTableCard
        logs={logs}
        loading={loading}
        refreshing={refreshing}
        fallback={fallback}
        showFallback={showFallback}
        selectedId={selectedLog?._id ?? null}
        onSelect={onSelect}
        tableAreaWidth={tableAreaWidth}
        onTableAreaWidth={onTableAreaWidth}
        showPagination={showPagination}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={onPageChange}
      />
    </View>
    <View style={{ flex: 24, minWidth: 300 }}>
      <LogDetailsPanel log={selectedLog} onClose={onClearSelection} />
    </View>
  </View>
);

export default DesktopLogsView;
