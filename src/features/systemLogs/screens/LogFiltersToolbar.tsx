import LogToolbar from "../components/LogToolbar";
import type { useLogFilters } from "../hooks/useLogFilters";

const LogFiltersToolbar = ({
  filters,
  isDesktop,
  onExport,
  exporting,
}: {
  filters: ReturnType<typeof useLogFilters>;
  isDesktop: boolean;
  onExport: () => void;
  exporting: boolean;
}) => (
  <LogToolbar
    search={filters.searchInput}
    onSearchChange={filters.setSearchInput}
    datePreset={filters.datePreset}
    onDatePresetChange={filters.setDatePreset}
    dateRangeLabel={filters.dateRangeLabel}
    customFrom={filters.customFrom}
    customTo={filters.customTo}
    onCustomFromChange={filters.setCustomFrom}
    onCustomToChange={filters.setCustomTo}
    role={filters.role}
    onRoleChange={filters.setRole}
    logType={filters.logType}
    onLogTypeChange={filters.setLogType}
    severity={filters.severity}
    onSeverityChange={filters.setSeverity}
    isDesktop={isDesktop}
    onExport={onExport}
    exporting={exporting}
  />
);

export default LogFiltersToolbar;
