import { parseToDate } from "@/utils/dateFormatter";
import type { AdminUser } from "../services/userService";
import { ROLE_FULL_LABELS } from "../components/usersTheme";
import type { RoleFilter, SortKey, StatusFilter } from "../components/userFilters";

/**
 * Whether an account matches the search box.
 *
 * Matches the role's full label as well as its key, so searching "Barangay
 * Health Worker" finds a `bhw` — the admin reads the label in the table and
 * has no reason to know the stored value.
 */
export function searchMatches(user: AdminUser, query: string): boolean {
  const needle = query.toLowerCase();
  return (
    user.fullname.toLowerCase().includes(needle) ||
    user.email.toLowerCase().includes(needle) ||
    user.address.toLowerCase().includes(needle) ||
    (ROLE_FULL_LABELS[user.role] ?? user.role).toLowerCase().includes(needle)
  );
}

/** A missing timestamp sorts as the epoch, so it lands last on a newest-first sort. */
const byTime = (value: string | null | undefined): number =>
  value ? parseToDate(value).getTime() : 0;

export function sortUsers(users: AdminUser[], sort: SortKey): AdminUser[] {
  return [...users].sort((a, b) => {
    switch (sort) {
      case "lastLogin_desc":
        return byTime(b.lastLogin) - byTime(a.lastLogin);
      case "lastLogin_asc":
        return byTime(a.lastLogin) - byTime(b.lastLogin);
      case "name_asc":
        return a.fullname.localeCompare(b.fullname);
      case "name_desc":
        return b.fullname.localeCompare(a.fullname);
      case "created_asc":
        return byTime(a.createdAt) - byTime(b.createdAt);
      case "created_desc":
      default:
        return byTime(b.createdAt) - byTime(a.createdAt);
    }
  });
}

/** Role, status and search applied together, then ordered. */
export function filterAndSortUsers(
  users: AdminUser[],
  filters: { role: RoleFilter; status: StatusFilter; search: string; sort: SortKey }
): AdminUser[] {
  let result = users;
  if (filters.role !== "all") result = result.filter((user) => user.role === filters.role);
  if (filters.status !== "all") result = result.filter((user) => user.status === filters.status);

  const query = filters.search.trim();
  if (query) result = result.filter((user) => searchMatches(user, query));

  return sortUsers(result, filters.sort);
}
