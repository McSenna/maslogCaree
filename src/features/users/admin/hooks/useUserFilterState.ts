import { useCallback, useState } from "react";

import type { RoleFilter, StatusFilter, UserSort, UserTab } from "../userAdmin.types";
import { useDebouncedValue } from "./useDebouncedValue";

export const SEARCH_DEBOUNCE_MS = 300;

const USER_TABS: readonly UserTab[] = ["active", "requests", "rejected", "deactivated", "masterlist"];

/** `?section=requests` (the dashboard's "Review registrations" shortcut) opens on that tab. */
export const tabFromParam = (value: string): UserTab =>
  (USER_TABS as readonly string[]).includes(value) ? (value as UserTab) : "active";

/**
 * Tab, search, filters, sort and page. Any change other than paging goes
 * back to page 1, so the user never lands on a page past the new results.
 */
export const useUserFilterState = (initialTab: UserTab) => {
  const [tab, setTabState] = useState<UserTab>(initialTab);
  const [queryInput, setQueryInput] = useState("");
  const [role, setRoleState] = useState<RoleFilter>("all");
  const [status, setStatusState] = useState<StatusFilter>("all");
  const [sort, setSortState] = useState<UserSort>("last_login_desc");
  const [page, setPage] = useState(1);
  const query = useDebouncedValue(queryInput.trim(), SEARCH_DEBOUNCE_MS);

  const firstPage = <T,>(apply: (value: T) => void) => (value: T) => {
    apply(value);
    setPage(1);
  };

  const setQuery = useCallback((value: string) => {
    setQueryInput(value);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setQueryInput("");
    setRoleState("all");
    setStatusState("all");
    setPage(1);
  }, []);

  return {
    tab,
    setTab: firstPage(setTabState),
    queryInput,
    query,
    setQuery,
    role,
    setRole: firstPage(setRoleState),
    status,
    setStatus: firstPage(setStatusState),
    sort,
    setSort: firstPage(setSortState),
    page,
    setPage,
    clearFilters,
    hasFilters: query !== "" || role !== "all" || status !== "all",
  };
};

export type UserFilterState = ReturnType<typeof useUserFilterState>;
