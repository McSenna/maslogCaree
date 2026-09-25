import { useCallback, useState } from "react";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";
import type { SystemLog } from "../services/systemLogService";

export const useLogSelection = (logs: SystemLog[], isDesktop: boolean, filterKey: string) => {
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // On desktop, preselect the first log once per filter so the detail panel isn't empty.
  useSyncOnChange([isDesktop, logs], () => {
    if (!isDesktop || hasAutoSelected || logs.length === 0) return;
    setSelectedLog(logs[0]);
    setHasAutoSelected(true);
  });

  useSyncOnChange([filterKey], () => setHasAutoSelected(false));

  const selectLog = useCallback(
    (log: SystemLog) => {
      setSelectedLog(log);
      if (!isDesktop) setSheetVisible(true);
    },
    [isDesktop]
  );

  return {
    selectedLog,
    selectLog,
    clearSelection: () => setSelectedLog(null),
    sheetVisible,
    closeSheet: () => setSheetVisible(false),
  };
};
