import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminUser } from "../services/userService";
import type { RoleFilter, SortKey, StatusFilter } from "../components/userFilters";
import { PAGE_SIZE } from "../constants/usersLayout";
import { filterAndSortUsers } from "../utils/userSearch";

/**
 * The search, filters, sort and page over an already-loaded list.
 *
 * All client-side: the accounts endpoint returns every user in one request, so
 * narrowing them is a local operation and a round trip per keystroke would buy
 * nothing.
 */
export function useUserFilters(users: AdminUser[]) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("lastLogin_desc");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(
    () => filterAndSortUsers(users, { role, status, search, sort }),
    [users, role, status, search, sort]
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  // Narrowing the results can leave the current page past the end of the list.
  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const pageUsers = useMemo(
    () => filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredUsers, page]
  );

  /** Any change to what is being looked for returns to the first page. */
  const withPageReset = useCallback(
    <T,>(apply: (value: T) => void) =>
      (value: T) => {
        apply(value);
        setPage(1);
      },
    []
  );

  return {
    search,
    onSearchChange: withPageReset(setSearch),
    role,
    onRoleChange: withPageReset(setRole),
    status,
    onStatusChange: withPageReset(setStatus),
    sort,
    onSortChange: withPageReset(setSort),
    page,
    setPage,
    totalPages,
    filteredUsers,
    pageUsers,
    hasActiveFilters: search.trim().length > 0 || role !== "all" || status !== "all",
  };
}
