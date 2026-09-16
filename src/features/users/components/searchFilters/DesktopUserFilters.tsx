import { View } from "react-native";
import SearchField from "@/components/ui/SearchField";
import SelectMenu from "@/components/ui/SelectMenu";
import { ROLE_FILTER_OPTIONS, SORT_OPTIONS, STATUS_FILTER_OPTIONS } from "../userFilters";
import { CONTROL_HEIGHT } from "../usersTheme";
import AddUserButton from "./AddUserButton";
import type { UserSearchFiltersFields } from "./searchFiltersProps";

const DesktopUserFilters = (props: UserSearchFiltersFields) => (
  <View className="w-full flex-row items-center gap-3">
    <SearchField
      value={props.search}
      onChangeText={props.onSearchChange}
      placeholder="Search users by name, email, or department..."
      accessibilityLabel="Search users"
      style={{ flex: 40 }}
    />
    <SelectMenu
      label="Filter by role"
      value={props.role}
      options={ROLE_FILTER_OPTIONS}
      onChange={props.onRoleChange}
      height={CONTROL_HEIGHT}
      style={{ flex: 15, minWidth: 140 }}
    />
    <SelectMenu
      label="Filter by status"
      value={props.status}
      options={STATUS_FILTER_OPTIONS}
      onChange={props.onStatusChange}
      height={CONTROL_HEIGHT}
      style={{ flex: 15, minWidth: 140 }}
    />
    <SelectMenu
      label="Sort users"
      value={props.sort}
      options={SORT_OPTIONS}
      onChange={props.onSortChange}
      icon="swap-vertical"
      height={CONTROL_HEIGHT}
      style={{ flex: 18, minWidth: 205 }}
    />
    <AddUserButton onPress={props.onAddUser} />
  </View>
);

export default DesktopUserFilters;
