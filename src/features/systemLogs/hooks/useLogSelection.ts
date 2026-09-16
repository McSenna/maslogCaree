import { useCallback, useEffect, useRef, useState } from "react";
import type { SystemLog } from "../services/systemLogService";

export const useLogSelection = (logs: SystemLog[], isDesktop: boolean, filterKey: string) => {
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const hasAutoSelectedRef = useRef(false);

  useEffect(() => {
    if (!isDesktop) return;
    if (hasAutoSelectedRef.current) return;
    if (logs.length > 0) {
      setSelectedLog(logs[0]);
      hasAutoSelectedRef.current = true;
    }
  }, [isDesktop, logs]);

  useEffect(() => {
    hasAutoSelectedRef.current = false;
  }, [filterKey]);

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
