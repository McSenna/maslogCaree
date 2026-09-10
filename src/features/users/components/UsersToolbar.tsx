import type { UserManagementController } from "../hooks/useUserManagementScreen";
import UserSearchFilters from "./UserSearchFilters";

type UsersToolbarProps = {
  controller: UserManagementController;
};

/** Search, role, status and sort — the same controls in both layouts. */
export default function UsersToolbar({ controller }: UsersToolbarProps) {
  const { filters } = controller;

  return (
    <UserSearchFilters
      search={filters.search}
      onSearchChange={filters.onSearchChange}
      role={filters.role}
      onRoleChange={filters.onRoleChange}
      status={filters.status}
      onStatusChange={filters.onStatusChange}
      sort={filters.sort}
      onSortChange={filters.onSortChange}
      onAddUser={controller.addUser}
      isDesktop={controller.showTable}
      resultCount={filters.filteredUsers.length}
    />
  );
}
