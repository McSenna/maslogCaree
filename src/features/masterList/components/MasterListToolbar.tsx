import { View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import SearchField from "@/components/ui/SearchField";
import SelectMenu from "@/components/ui/SelectMenu";
import { CONTROL_HEIGHT } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MasterListState } from "../hooks/useMasterList";
import { MASTER_ROLE_FILTER_OPTIONS, MASTER_PUROK_FILTER_OPTIONS, MASTER_CIVIL_STATUS_FILTER_OPTIONS } from "../masterListFilters";

type Props = { list: MasterListState; phone?: boolean };

const SEARCH_STYLE = { width: 300 } as const;
const CONTROL_GAP = 8;

// Civil status fits its longest label, "Single - Solo Parent", without an ellipsis.
const WIDTHS = {
  fixed: { role: { width: 140 }, civilStatus: { width: 184 }, purok: { width: 256 } },
  shared: { role: { flex: 1, minWidth: 130 }, civilStatus: { flex: 1, minWidth: 180 }, purok: { flex: 1, minWidth: 220 } },
} as const;

/** The search and all three filters at their fixed widths, on one line. */
export const MASTER_TOOLBAR_WIDTH =
  SEARCH_STYLE.width + WIDTHS.fixed.role.width + WIDTHS.fixed.civilStatus.width + WIDTHS.fixed.purok.width + CONTROL_GAP * 3;

export const MasterListSearch = ({ list, phone = false }: Props) => (
  <SearchField
    value={list.queryInput}
    onChangeText={list.setQuery}
    placeholder="Search name, record ID or birth date"
    accessibilityLabel="Search the master list"
    accessibilityHint="Birth dates can be typed as Mar 15, 1990, 03/15/1990, a month name, a day, or a year."
    style={phone ? undefined : SEARCH_STYLE}
  />
);

export const MasterListFilterMenus = ({ list, phone = false }: Props) => {
  const widths = phone ? WIDTHS.shared : WIDTHS.fixed;
  return (
    <View className={`max-w-full flex-row flex-wrap gap-2 ${phone ? "w-full" : "justify-end"}`}>
      <SelectMenu
        label="Filter master list by role"
        value={list.role}
        options={MASTER_ROLE_FILTER_OPTIONS}
        onChange={list.setRole}
        height={CONTROL_HEIGHT}
        style={widths.role}
      />
      <SelectMenu
        label="Filter master list by civil status"
        value={list.civilStatus}
        options={MASTER_CIVIL_STATUS_FILTER_OPTIONS}
        onChange={list.setCivilStatus}
        height={CONTROL_HEIGHT}
        style={widths.civilStatus}
      />
      <SelectMenu
        label="Filter master list by purok"
        value={list.purok}
        options={MASTER_PUROK_FILTER_OPTIONS}
        onChange={list.setPurok}
        height={CONTROL_HEIGHT}
        style={widths.purok}
      />
    </View>
  );
};

export const MasterListClearButton = ({ list }: Props) => {
  const palette = useAdminSurfacePalette();
  if (!list.filtered && !list.queryInput) return null;

  return (
    <View className="self-end">
      <DashboardButton
        palette={palette}
        label="Clear filters"
        icon="x"
        variant="ghost"
        onPress={list.clearFilters}
        accessibilityLabel="Clear Master List search and filters"
      />
    </View>
  );
};

const MasterListToolbar = ({ list, phone = false }: Props) => (
  <View className="gap-2">
    <View className={phone ? "gap-2" : "flex-row flex-wrap items-center justify-end gap-2"}>
      <MasterListSearch list={list} phone={phone} />
      <MasterListFilterMenus list={list} phone={phone} />
    </View>
    <MasterListClearButton list={list} />
  </View>
);

export default MasterListToolbar;
