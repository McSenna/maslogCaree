import { useCallback, useState } from "react";
import { exportSystemLogs, type SystemLogsQuery } from "../services/systemLogService";
import { toast } from "@/components/feedback/toast/toastStore";

export const useLogExport = (exportParams: SystemLogsQuery) => {
  const [exporting, setExporting] = useState(false);

  const exportLogs = useCallback(async () => {
    setExporting(true);
    try {
      await exportSystemLogs(exportParams);
    } catch {
      toast.error("Export failed", "Failed to export system logs. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [exportParams]);

  return { exporting, exportLogs };
};
