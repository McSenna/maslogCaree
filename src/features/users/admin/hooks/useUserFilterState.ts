import { useCallback } from "react";

import { usePersistedPagination } from "@/hooks/usePersistedPagination";
import type { ListSchema } from "@/lib/listState/listStateCodec";

import type { RoleFilter, StatusFilter, UserSort, UserTab } from "../userAdmin.types";
import { ROLES } from "../userAdminModel";

export const SEARCH_DEBOUNCE_MS = 300;

const USER_TABS: readonly UserTab[] = ["active", "requests", "rejected", "deactivated", "accounts", "masterlist"];
const USER_SORTS: readonly UserSort[] = ["last_login_desc", "last_login_asc", "name_asc", "joined_desc"];
const STATUSES: readonly StatusFilter[] = ["all", "active", "approved", "deactivated"];
const ROLE_PARAMS = ["all", ...ROLES.map((role) => role.toLowerCase())];

type UserListFilters = { tab: string; role: string; status: string; sort: string };

/**
 * What the Users screen keeps in its URL. The names match the dashboard's
 * shortcuts (`?section=requests`, `?role=resident`, `?sort=joined_desc`), so
 * those links keep opening the right list. The search box is kept apart.
 */
const USER_LIST_SCHEMA: ListSchema<UserListFilters> = {
  fields: {
    tab: { kind: "enum", values: USER_TABS, fallback: "active", param: "section" },
    role: { kind: "enum", values: ROLE_PARAMS, fallback: "all" },
    status: { kind: "enum", values: STATUSES, fallback: "all" },
    sort: { kind: "enum", values: USER_SORTS, fallback: "last_login_desc" },
  },
  limits: [20],
};

const roleOf = (param: string): RoleFilter => ROLES.find((role) => role.toLowerCase() === param) ?? "all";

type Options = {
  /** Phones append pages as the user scrolls, so the page is not restored there. */
  appendPages: boolean;
  /** Rows the visible list reported, null while unknown or while another list (Masterlist) is shown. */
  total: number | null;
};

/**
 * Tab, search, filters, sort and page, kept in the URL (and on phones, the
 * last view). Any change other than paging goes back to page 1, so the user
 * never lands on a page past the new results.
 */
export const useUserFilterState = ({ appendPages, total }: Options) => {
  const list = usePersistedPagination({
    key: "users",
    schema: USER_LIST_SCHEMA,
    total,
    persistPage: !appendPages,
    searchDebounceMs: SEARCH_DEBOUNCE_MS,
  });
  const { filters, setFilters, replaceSearch, search: query } = list;
  const tab = filters.tab as UserTab;
  const role = roleOf(filters.role);
  const status = filters.status as StatusFilter;
  const sort = filters.sort as UserSort;

  const setTab = useCallback((next: UserTab) => setFilters({ tab: next }), [setFilters]);
  const setRole = useCallback((next: RoleFilter) => setFilters({ role: next.toLowerCase() }), [setFilters]);
  const setStatus = useCallback((next: StatusFilter) => setFilters({ status: next }), [setFilters]);
  const setSort = useCallback((next: UserSort) => setFilters({ sort: next }), [setFilters]);

  const clearFilters = useCallback(() => {
    replaceSearch("");
    setFilters({ role: "all", status: "all" });
  }, [replaceSearch, setFilters]);

  return {
    tab,
    setTab,
    queryInput: list.searchInput,
    query,
    setQuery: list.setSearchInput,
    role,
    setRole,
    status,
    setStatus,
    sort,
    setSort,
    page: list.page,
    setPage: list.setPage,
    isClamping: list.isClamping,
    clearFilters,
    hasFilters: query !== "" || role !== "all" || status !== "all",
  };
};

export type UserFilterState = ReturnType<typeof useUserFilterState>;
