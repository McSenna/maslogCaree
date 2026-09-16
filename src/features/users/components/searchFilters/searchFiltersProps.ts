import type { RoleFilter, SortKey, StatusFilter } from "../userFilters";

export type UserSearchFiltersFields = {
  search: string;
  onSearchChange: (value: string) => void;
  role: RoleFilter;
  onRoleChange: (value: RoleFilter) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  onAddUser: () => void;
};
