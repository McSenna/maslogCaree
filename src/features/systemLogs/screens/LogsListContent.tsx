import type { ReactNode } from "react";
import LogsEmptyState from "../components/LogsEmptyState";
import LogsErrorState from "../components/LogsErrorState";
import { MobileLogCardSkeleton } from "../components/LogsSkeleton";
import MobileLogList from "../components/MobileLogList";
import { PAGE_SIZE } from "../constants/logsLayout";
import type { SystemLog } from "../services/systemLogService";

export const buildFallback = (error: string | null, hasActiveFilters: boolean, onRetry: () => void): ReactNode =>
  error ? (
    <LogsErrorState message={error} onRetry={onRetry} bare />
  ) : (
    <LogsEmptyState hasFilters={hasActiveFilters} bare />
  );

export const buildMobileContent = ({
  loading,
  refreshing,
  error,
  logs,
  hasActiveFilters,
  selectedId,
  onSelect,
  onRetry,
}: {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  logs: SystemLog[];
  hasActiveFilters: boolean;
  selectedId: string | null;
  onSelect: (log: SystemLog) => void;
  onRetry: () => void;
}): ReactNode => {
  if (loading && !refreshing) return <MobileLogCardSkeleton count={Math.min(PAGE_SIZE, 6)} />;
  if (error) return <LogsErrorState message={error} onRetry={onRetry} />;
  if (logs.length === 0) return <LogsEmptyState hasFilters={hasActiveFilters} />;
  return <MobileLogList logs={logs} selectedId={selectedId} onSelect={onSelect} />;
};
