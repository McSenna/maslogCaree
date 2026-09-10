import { useCallback, useState } from "react";
import { showAlert } from "@/utils/notify";
import { exportSystemLogs, type SystemLogsQuery } from "../services/systemLogService";

/**
 * Downloading the current result set.
 *
 * Exports whatever the filters currently select, not just the visible page —
 * an audit export of eight rows would rarely be what was wanted.
 */
export function useLogExport(exportParams: SystemLogsQuery) {
  const [exporting, setExporting] = useState(false);

  const exportLogs = useCallback(async () => {
    setExporting(true);
    try {
      await exportSystemLogs(exportParams);
    } catch {
      showAlert("Export failed", "Failed to export system logs. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [exportParams]);

  return { exporting, exportLogs };
}
