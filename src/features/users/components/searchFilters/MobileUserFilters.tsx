import { Text, View } from "react-native";
import SearchField from "@/components/ui/SearchField";
import SelectMenu from "@/components/ui/SelectMenu";
import { ROLE_FILTER_OPTIONS, SORT_OPTIONS, STATUS_FILTER_OPTIONS } from "../userFilters";
import { CONTROL_HEIGHT, useUsersPalette } from "../usersTheme";
import AddUserButton from "./AddUserButton";
import type { UserSearchFiltersFields } from "./searchFiltersProps";

const MobileUserFilters = (props: UserSearchFiltersFields & { resultCount: number }) => {
  const palette = useUsersPalette();

  return (
    <View className="w-full gap-3">
      <SearchField
        value={props.search}
        onChangeText={props.onSearchChange}
        placeholder="Search users by name, email, or department..."
        accessibilityLabel="Search users"
      />

      <View className="w-full flex-row flex-wrap gap-2">
        <SelectMenu
          label="Filter by role"
          value={props.role}
          options={ROLE_FILTER_OPTIONS}
          onChange={props.onRoleChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 1, minWidth: 100 }}
        />
        <SelectMenu
          label="Filter by status"
          value={props.status}
          options={STATUS_FILTER_OPTIONS}
          onChange={props.onStatusChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 1, minWidth: 112 }}
        />
        <SelectMenu
          label="Sort users"
          value={props.sort}
          options={SORT_OPTIONS}
          onChange={props.onSortChange}
          icon="swap-vertical"
          height={CONTROL_HEIGHT}
          style={{ flex: 1.3, minWidth: 186 }}
        />
      </View>

      <View className="w-full flex-row items-center justify-between gap-3">
        <Text className="text-[15px] font-semibold" style={{ color: palette.heading }}>
          {props.resultCount.toLocaleString()} {props.resultCount === 1 ? "user" : "users"}
        </Text>
        <AddUserButton onPress={props.onAddUser} />
      </View>
    </View>
  );
};

export default MobileUserFilters;
