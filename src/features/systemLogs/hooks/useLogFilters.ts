import { useEffect, useMemo, useState } from "react";
import {
  buildDateRange,
  DEFAULT_DATE_PRESET,
  formatDateRangeLabel,
  type DatePreset,
} from "../components/LogToolbar";
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../constants/logsLayout";

/** `all` means the filter is off, and is dropped from the request entirely. */
const asParam = (value: string): string | undefined => (value === "all" ? undefined : value);

/**
 * Everything narrowing the audit trail: the search box, the date range, and
 * the three category filters.
 *
 * All of it is server-side — the log table can hold far more than one client
 * should ever load — so this hook's real output is `params`, the query the
 * fetching hook runs.
 */
export function useLogFilters(initialSearch: string) {
  // Seeded from the route so "View Activity Logs" on a user can land here
  // already narrowed to that account. Read once, as the initial value: the
  // search box stays the admin's to clear, and re-applying the parameter on
  // every render would fight them for it.
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  // The date filter opens on "All Time": an audit trail is most useful when it
  // starts by showing everything it holds, and any narrower default silently
  // hides older entries from an admin who never opened the filter.
  const [datePreset, setDatePreset] = useState<DatePreset>(DEFAULT_DATE_PRESET);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [role, setRole] = useState("all");
  const [logType, setLogType] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [page, setPage] = useState(1);

  // Debounce free-text search so it doesn't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const dateRange = useMemo(
    () => buildDateRange(datePreset, customFrom, customTo),
    [datePreset, customFrom, customTo]
  );

  const dateRangeLabel = useMemo(
    () => formatDateRangeLabel(datePreset, dateRange.fromDate, dateRange.toDate),
    [datePreset, dateRange]
  );

  /** Narrowing the results always returns to the first page. */
  const setAndResetPage =
    <T,>(apply: (value: T) => void) =>
    (value: T) => {
      apply(value);
      setPage(1);
    };

  const params = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      role: asParam(role),
      logType: asParam(logType),
      severity: asParam(severity),
      sort: "desc" as const,
      ...dateRange,
    }),
    [page, search, role, logType, severity, dateRange]
  );

  /** The same filters without paging, for an export of the whole result set. */
  const exportParams = useMemo(
    () => ({
      search: search || undefined,
      role: asParam(role),
      logType: asParam(logType),
      severity: asParam(severity),
      sort: "desc" as const,
      ...dateRange,
    }),
    [search, role, logType, severity, dateRange]
  );

  return {
    searchInput,
    setSearchInput,
    datePreset,
    setDatePreset: setAndResetPage(setDatePreset),
    dateRangeLabel,
    dateRange,
    customFrom,
    setCustomFrom: setAndResetPage(setCustomFrom),
    customTo,
    setCustomTo: setAndResetPage(setCustomTo),
    role,
    setRole: setAndResetPage(setRole),
    logType,
    setLogType: setAndResetPage(setLogType),
    severity,
    setSeverity: setAndResetPage(setSeverity),
    page,
    setPage,
    params,
    exportParams,
    hasActiveFilters:
      search.length > 0 ||
      role !== "all" ||
      logType !== "all" ||
      severity !== "all" ||
      datePreset !== DEFAULT_DATE_PRESET,
  };
}
