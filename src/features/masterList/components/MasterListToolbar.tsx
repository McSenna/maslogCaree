import { View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import SearchField from "@/components/ui/SearchField";
import SelectMenu from "@/components/ui/SelectMenu";
import { CONTROL_HEIGHT } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MasterListState } from "../hooks/useMasterList";
import { MASTER_ROLE_FILTER_OPTIONS, MASTER_PUROK_FILTER_OPTIONS, MASTER_CIVIL_STATUS_FILTER_OPTIONS } from "../masterListFilters";

type Props = { list: MasterListState; phone?: boolean };

const WIDTHS = {
  fixed: { role: { width: 140 }, civilStatus: { width: 176 }, purok: { width: 256 } },
  shared: { role: { flex: 1, minWidth: 130 }, civilStatus: { flex: 1, minWidth: 164 }, purok: { flex: 1, minWidth: 220 } },
} as const;

const MasterListToolbar = ({ list, phone = false }: Props) => {
  const palette = useAdminSurfacePalette();
  const widths = phone ? WIDTHS.shared : WIDTHS.fixed;
  const canReset = list.filtered || Boolean(list.queryInput);

  return (
    <View className="gap-2">
      <View className={phone ? "gap-2" : "flex-row flex-wrap items-center justify-end gap-2"}>
        <SearchField
          value={list.queryInput}
          onChangeText={list.setQuery}
          placeholder="Search name, role or record ID"
          accessibilityLabel="Search the master list"
          style={phone ? undefined : { width: 300 }}
        />
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
      </View>
      {canReset ? (
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
      ) : null}
    </View>
  );
};

export default MasterListToolbar;
