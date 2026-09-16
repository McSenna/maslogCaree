import { useEffect, useMemo, useState } from "react";
import {
  buildDateRange,
  DEFAULT_DATE_PRESET,
  formatDateRangeLabel,
  type DatePreset,
} from "../components/LogToolbar";
import { endOfLocalDay, startOfLocalDay } from "@/utils/dateFormatter";
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../constants/logsLayout";

const asParam = (value: string): string | undefined => (value === "all" ? undefined : value);

export const useLogFilters = (initialSearch: string) => {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [datePreset, setDatePreset] = useState<DatePreset>(DEFAULT_DATE_PRESET);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [role, setRole] = useState("all");
  const [logType, setLogType] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [page, setPage] = useState(1);

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
      ...dateParams,
    }),
    [page, search, role, logType, severity, dateParams]
  );

  const exportParams = useMemo(
    () => ({
      search: search || undefined,
      role: asParam(role),
      logType: asParam(logType),
      severity: asParam(severity),
      sort: "desc" as const,
      ...dateParams,
    }),
    [search, role, logType, severity, dateParams]
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
};
