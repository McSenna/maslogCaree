import { View } from "react-native";

import { DataTable } from "@/components/data-table";

import LogDetailsPanel from "../components/LogDetailsPanel";
import { logColumns } from "../components/logColumns";
import { logsEmptyCopy } from "../components/LogsEmptyState";
import { LOGS_ERROR } from "../components/LogsErrorState";
import { PAGE_SIZE } from "../constants/logsLayout";
import type { SystemLog } from "../services/systemLogService";

type DesktopLogsViewProps = {
  logs: SystemLog[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onRetry: () => void;
  selectedLog: SystemLog | null;
  onSelect: (log: SystemLog) => void;
  onClearSelection: () => void;
  page: number;
  total: number;
  onPageChange: (page: number) => void;
};

const DesktopLogsView = ({ logs, loading, refreshing, error, hasActiveFilters, onRetry, selectedLog, onSelect, onClearSelection, page, total, onPageChange }: DesktopLogsViewProps) => {
  const columns = logColumns({ onOpen: onSelect });
  const empty = logsEmptyCopy(hasActiveFilters);

  return (
    <View className="w-full flex-row items-start gap-4">
      <View className="min-w-0 flex-[76]">
        <DataTable
          caption="System logs"
          columns={columns}
          data={logs}
          rowKey={(log) => log._id}
          loading={loading && !refreshing}
          refreshing={refreshing}
          error={error}
          errorTitle={LOGS_ERROR}
          onRetry={onRetry}
          emptyIcon="activity"
          emptyTitle={empty.title}
          emptyDescription={empty.description}
          onRowPress={onSelect}
          rowPressMode="pointer"
          isRowSelected={(log) => log._id === selectedLog?._id}
          pagination={{ page, pageSize: PAGE_SIZE, total, onPageChange, noun: "logs" }}
        />
      </View>
      <View className="min-w-[300px] flex-[24]">
        <LogDetailsPanel log={selectedLog} onClose={onClearSelection} />
      </View>
    </View>
  );
};

export default DesktopLogsView;
