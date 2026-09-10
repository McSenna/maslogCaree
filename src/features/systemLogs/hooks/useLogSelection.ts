import { useCallback, useEffect, useRef, useState } from "react";
import type { SystemLog } from "../services/systemLogService";

/**
 * Which log entry is open, and where its detail is shown.
 *
 * Desktop opens straight to the first row, matching the reference layout —
 * the details column would otherwise sit empty beside a full table. Mobile has
 * no column, so it opens a sheet only once a card is tapped.
 */
export function useLogSelection(logs: SystemLog[], isDesktop: boolean, filterKey: string) {
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

  /** A new result set gets a fresh auto-selection. */
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
}
