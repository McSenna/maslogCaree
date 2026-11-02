import { View } from "react-native";

import SelectMenu, { type SelectOption } from "@/components/ui/SelectMenu";

import type { UserFilterState } from "../../hooks/useUserFilterState";
import type { RoleFilter, StatusFilter } from "../../userAdmin.types";
import { ROLES, STATUS_LABELS, statusOptionsFor } from "../../userAdminModel";

const ROLE_OPTIONS: SelectOption<RoleFilter>[] = [
  { value: "all", label: "All roles" },
  ...ROLES.map((role) => ({ value: role, label: role })),
];

// Shares wrap on narrow rows; fixed widths fit each filter label.
const WIDTHS = {
  fixed: { role: { width: 150 }, status: { width: 164 } },
  shared: { role: { flex: 1, minWidth: 150 }, status: { flex: 1, minWidth: 150 } },
} as const;

type UserFiltersProps = {
  filters: UserFilterState;
  /** Fixed widths beside the search field (wide), or equal shares across the row (phones, tablets). */
  fixed?: boolean;
  height: number;
};

/** Role and status combine with each other and with search. */
const UserFilters = ({ filters, fixed, height }: UserFiltersProps) => {
  const widths = fixed ? WIDTHS.fixed : WIDTHS.shared;
  const statuses = statusOptionsFor(filters.tab);
  const statusOptions: SelectOption<StatusFilter>[] = [
    { value: "all", label: "All statuses" },
    ...statuses.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
  ];
  return (
    <View className={`flex-row flex-wrap gap-2 ${fixed ? "" : "w-full"}`}>
      <SelectMenu label="Role" value={filters.role} options={ROLE_OPTIONS} onChange={filters.setRole} height={height} style={widths.role} />
      <SelectMenu label="Status" value={filters.status} options={statusOptions} onChange={filters.setStatus} height={height} style={widths.status} disabled={statuses.length === 0} />
    </View>
  );
};

export default UserFilters;
