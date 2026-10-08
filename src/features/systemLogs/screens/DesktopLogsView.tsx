import { useState } from "react";
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

/** Rows checked on the current page of logs. */
const usePageChecks = (logs: SystemLog[]) => {
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set());
  const onPage = logs.filter((log) => checked.has(log._id)).length;
  const allChecked = logs.length > 0 && onPage === logs.length;
  return {
    isChecked: (id: string) => checked.has(id),
    allChecked,
    someChecked: onPage > 0 && !allChecked,
    onToggle: (id: string) =>
      setChecked((previous) => {
        const next = new Set(previous);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }),
    onToggleAll: () => setChecked(allChecked ? new Set() : new Set(logs.map((log) => log._id))),
  };
};

const DesktopLogsView = ({ logs, loading, refreshing, error, hasActiveFilters, onRetry, selectedLog, onSelect, onClearSelection, page, total, onPageChange }: DesktopLogsViewProps) => {
  // The check handlers change every render, so the columns are rebuilt with them rather than memoised.
  const columns = logColumns({ ...usePageChecks(logs), onOpen: onSelect });
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
