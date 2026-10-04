import { useCallback, useMemo } from "react";
import { usePersistedPagination } from "@/hooks/usePersistedPagination";
import {
  buildDateRange,
  DEFAULT_DATE_PRESET,
  formatDateRangeLabel,
  type DatePreset,
} from "../components/LogToolbar";
import { endOfLocalDay, startOfLocalDay } from "@/utils/dateFormatter";
import { SEARCH_DEBOUNCE_MS } from "../constants/logsLayout";
import {
  activeLogCard,
  LOG_CARD_FILTERS,
  monthToDateRange,
  type LogCardKey,
  type LogOutcome,
} from "../components/toolbar/logCardFilters";
import { LOG_LIST_SCHEMA } from "./logListSchema";

const asParam = (value: string): string | undefined => (value === "all" ? undefined : value);

/**
 * Search, date range, filters and page for the system log table, kept in the
 * URL (and on phones, the last view) so a refresh lands on the same page.
 * `total` is the entry count of the last load, null before the first.
 */
export const useLogFilters = (initialSearch: string, total: number | null) => {
  const list = usePersistedPagination({
    key: "system-logs",
    schema: LOG_LIST_SCHEMA,
    total,
    searchDebounceMs: SEARCH_DEBOUNCE_MS,
    initialSearch,
  });
  const { filters, page, limit, search, setFilters, replaceSearch } = list;
  const { customFrom, customTo, role, logType, severity } = filters;
  const datePreset = filters.datePreset as DatePreset;
  const outcome = filters.outcome as LogOutcome;

  const dateRange = useMemo(
    () => buildDateRange(datePreset, customFrom, customTo),
    [datePreset, customFrom, customTo]
  );

  const dateRangeLabel = useMemo(
    () => formatDateRangeLabel(datePreset, dateRange.fromDay, dateRange.toDay),
    [datePreset, dateRange]
  );

  const dateParams = useMemo(
    () => ({
      fromDate: dateRange.fromDay ? startOfLocalDay(dateRange.fromDay) : undefined,
      toDate: dateRange.toDay ? endOfLocalDay(dateRange.toDay) : undefined,
    }),
    [dateRange]
  );

  const params = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      role: asParam(role),
      logType: asParam(logType),
      severity: asParam(severity),
      outcome: outcome === "all" ? undefined : outcome,
      sort: "desc" as const,
      ...dateParams,
    }),
    [page, limit, search, role, logType, severity, outcome, dateParams]
  );

  const exportParams = useMemo(
    () => ({
      search: search || undefined,
      role: asParam(role),
      logType: asParam(logType),
      severity: asParam(severity),
      outcome: outcome === "all" ? undefined : outcome,
      sort: "desc" as const,
      ...dateParams,
    }),
    [search, role, logType, severity, outcome, dateParams]
  );

  // A summary card replaces every filter with the ones it counts by.
  const showCard = useCallback(
    (key: LogCardKey) => {
      const card = LOG_CARD_FILTERS[key];
      const range = card.monthToDate ? monthToDateRange() : { from: customFrom, to: customTo };
      replaceSearch("");
      setFilters({
        role: "all",
        logType: "all",
        severity: card.severity,
        outcome: card.outcome,
        datePreset: card.datePreset,
        customFrom: range.from,
        customTo: range.to,
      });
    },
    [customFrom, customTo, replaceSearch, setFilters]
  );

  const setFilter = (field: "datePreset" | "customFrom" | "customTo" | "role" | "logType" | "severity") => (value: string) =>
    setFilters({ [field]: value });

  return {
    searchInput: list.searchInput,
    setSearchInput: list.setSearchInput,
    datePreset,
    setDatePreset: setFilter("datePreset") as (value: DatePreset) => void,
    dateRangeLabel,
    dateRange,
    customFrom,
    setCustomFrom: setFilter("customFrom"),
    customTo,
    setCustomTo: setFilter("customTo"),
    role,
    setRole: setFilter("role"),
    logType,
    setLogType: setFilter("logType"),
    severity,
    setSeverity: setFilter("severity"),
    outcome,
    clearOutcome: () => setFilters({ outcome: "all" }),
    showCard,
    activeCard: activeLogCard({ search, role, logType, severity, outcome, datePreset, customFrom, customTo }),
    page,
    setPage: list.setPage,
    isClamping: list.isClamping,
    params,
    exportParams,
    hasActiveFilters:
      search.length > 0 ||
      role !== "all" ||
      logType !== "all" ||
      severity !== "all" ||
      outcome !== "all" ||
      datePreset !== DEFAULT_DATE_PRESET,
  };
};
