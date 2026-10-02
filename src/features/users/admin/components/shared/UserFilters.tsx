import { View } from "react-native";

import SelectMenu, { type SelectOption } from "@/components/ui/SelectMenu";

import type { UserFilterState } from "../../hooks/useUserFilterState";
import type { RoleFilter, StatusFilter, UserSort } from "../../userAdmin.types";
import { ROLES, STATUS_LABELS } from "../../userAdminModel";

const ROLE_OPTIONS: SelectOption<RoleFilter>[] = [
  { value: "all", label: "All roles" },
  ...ROLES.map((role) => ({ value: role, label: role })),
];

const STATUS_OPTIONS: SelectOption<StatusFilter>[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: STATUS_LABELS.active },
  { value: "approved", label: STATUS_LABELS.approved },
  { value: "deactivated", label: STATUS_LABELS.deactivated },
];

const SORT_OPTIONS: SelectOption<UserSort>[] = [
  { value: "last_login_desc", label: "Last login, newest" },
  { value: "last_login_asc", label: "Last login, oldest" },
  { value: "name_asc", label: "Name, A to Z" },
];

// Fixed widths fit "Last login, newest" without truncating; shares wrap on narrow rows.
const WIDTHS = {
  fixed: { role: { width: 140 }, status: { width: 150 }, sort: { width: 196 } },
  shared: { role: { flex: 1, minWidth: 130 }, status: { flex: 1, minWidth: 130 }, sort: { flex: 1, minWidth: 180 } },
} as const;

type UserFiltersProps = {
  filters: UserFilterState;
  /** Fixed widths beside the search field (wide), or equal shares across the row (phones, tablets). */
  fixed?: boolean;
  height: number;
};

/** Role, status and sort, in the dashboard's dropdown. They combine with each other and with search. */
const UserFilters = ({ filters, fixed, height }: UserFiltersProps) => {
  const widths = fixed ? WIDTHS.fixed : WIDTHS.shared;
  return (
    <View className={`flex-row flex-wrap gap-2 ${fixed ? "" : "w-full"}`}>
      <SelectMenu label="Role" value={filters.role} options={ROLE_OPTIONS} onChange={filters.setRole} height={height} style={widths.role} />
      <SelectMenu label="Status" value={filters.status} options={STATUS_OPTIONS} onChange={filters.setStatus} height={height} style={widths.status} />
      <SelectMenu label="Sort" value={filters.sort} options={SORT_OPTIONS} onChange={filters.setSort} height={height} style={widths.sort} />
    </View>
  );
};

export default UserFilters;
