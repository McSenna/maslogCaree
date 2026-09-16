import { Text, View } from "react-native";
import SearchField from "@/components/ui/SearchField";
import SelectMenu from "@/components/ui/SelectMenu";
import { CONTROL_HEIGHT, useUsersPalette } from "@/features/users/components/usersTheme";
import type { ResidentsController } from "../hooks/useResidents";
import { RESIDENT_SORT_OPTIONS, RESIDENT_STATUS_OPTIONS } from "./residentFilters";

type ResidentToolbarProps = {
  residents: ResidentsController;
  isDesktop: boolean;
};

const ResidentToolbar = ({ residents, isDesktop }: ResidentToolbarProps) => {
  const palette = useUsersPalette();

  const search = (
    <SearchField
      value={residents.searchInput}
      onChangeText={residents.onSearchChange}
      placeholder="Search residents..."
      accessibilityLabel="Search residents by name, resident ID, email, or contact number"
      style={isDesktop ? { flex: 40 } : undefined}
    />
  );

  const statusMenu = (
    <SelectMenu
      label="Filter by status"
      value={residents.status}
      options={RESIDENT_STATUS_OPTIONS}
      onChange={residents.onStatusChange}
      height={CONTROL_HEIGHT}
      style={isDesktop ? { flex: 16, minWidth: 150 } : { flex: 1, minWidth: 132 }}
    />
  );

  const sortMenu = (
    <SelectMenu
      label="Sort residents"
      value={residents.sort}
      options={RESIDENT_SORT_OPTIONS}
      onChange={residents.onSortChange}
      icon="swap-vertical"
      height={CONTROL_HEIGHT}
      style={isDesktop ? { flex: 18, minWidth: 196 } : { flex: 1.2, minWidth: 178 }}
    />
  );

  if (isDesktop) {
    return (
      <View className="w-full flex-row items-center gap-3">
        {search}
        {statusMenu}
        {sortMenu}
      </View>
    );
  }

  return (
    <View className="w-full gap-3">
      {search}
      <View className="w-full flex-row flex-wrap gap-2">
        {statusMenu}
        {sortMenu}
      </View>
      <Text className="text-[15px] font-semibold" style={{ color: palette.heading }}>
        {residents.total.toLocaleString()} {residents.total === 1 ? "resident" : "residents"}
      </Text>
    </View>
  );
};

export default ResidentToolbar;
