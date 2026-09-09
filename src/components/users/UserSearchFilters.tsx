import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import SearchField from "./SearchField";
import SelectMenu from "./SelectMenu";
import {
  ROLE_FILTER_OPTIONS,
  SORT_OPTIONS,
  STATUS_FILTER_OPTIONS,
  type RoleFilter,
  type SortKey,
  type StatusFilter,
} from "./userFilters";
import { CONTROL_HEIGHT, RADIUS, useUsersPalette } from "./usersTheme";

type UserSearchFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  role: RoleFilter;
  onRoleChange: (value: RoleFilter) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  onAddUser: () => void;
  /** Desktop puts every control on one row; mobile stacks search / filters / action. */
  isDesktop: boolean;
  /** Mobile only — the count that sits opposite the Add User button. */
  resultCount?: number;
};

function AddUserButton({ onPress, fullWidth = false }: { onPress: () => void; fullWidth?: boolean }) {
  const palette = useUsersPalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add user"
      // Press feedback rides on the class, not on a style callback:
      // react-native-web drops a function-form `style` on Pressable entirely,
      // taking the button's fill and height with it.
      className="flex-row items-center justify-center gap-2 px-5 active:opacity-85"
      style={{
        height: CONTROL_HEIGHT,
        borderRadius: RADIUS.control,
        backgroundColor: palette.primary,
        alignSelf: fullWidth ? "stretch" : "auto",
      }}
    >
      <Feather name="plus" size={17} color="#FFFFFF" />
      <Text className="text-[14px] font-semibold text-white">Add User</Text>
    </Pressable>
  );
}

export default function UserSearchFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onAddUser,
  isDesktop,
  resultCount = 0,
}: UserSearchFiltersProps) {
  const palette = useUsersPalette();

  if (isDesktop) {
    // Proportions follow the design: the search field is the widest control and
    // the three menus share the rest, with the button sized to its label.
    return (
      <View className="w-full flex-row items-center gap-3">
        <SearchField
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search users by name, email, or department..."
          accessibilityLabel="Search users"
          style={{ flex: 40 }}
        />
        <SelectMenu
          label="Filter by role"
          value={role}
          options={ROLE_FILTER_OPTIONS}
          onChange={onRoleChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 15, minWidth: 140 }}
        />
        <SelectMenu
          label="Filter by status"
          value={status}
          options={STATUS_FILTER_OPTIONS}
          onChange={onStatusChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 15, minWidth: 140 }}
        />
        <SelectMenu
          label="Sort users"
          value={sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
          icon="swap-vertical"
          height={CONTROL_HEIGHT}
          // Wide enough for "Last Login (Newest)" in full at 1366px, where the
          // row is tightest; the search field absorbs the difference.
          style={{ flex: 18, minWidth: 205 }}
        />
        <AddUserButton onPress={onAddUser} />
      </View>
    );
  }

  return (
    <View className="w-full gap-3">
      <SearchField
        value={search}
        onChangeText={onSearchChange}
        placeholder="Search users by name, email, or department..."
        accessibilityLabel="Search users"
      />

      {/* One row wherever the three fit — a wide phone, a tablet — and the sort
          control drops to its own line only when keeping it inline would clip
          its label. The minimum widths are what each label needs in full, so
          nothing is ever truncated to hold the row together. */}
      <View className="w-full flex-row flex-wrap gap-2">
        <SelectMenu
          label="Filter by role"
          value={role}
          options={ROLE_FILTER_OPTIONS}
          onChange={onRoleChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 1, minWidth: 100 }}
        />
        <SelectMenu
          label="Filter by status"
          value={status}
          options={STATUS_FILTER_OPTIONS}
          onChange={onStatusChange}
          height={CONTROL_HEIGHT}
          style={{ flex: 1, minWidth: 112 }}
        />
        <SelectMenu
          label="Sort users"
          value={sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
          icon="swap-vertical"
          height={CONTROL_HEIGHT}
          style={{ flex: 1.3, minWidth: 186 }}
        />
      </View>

      <View className="w-full flex-row items-center justify-between gap-3">
        <Text className="text-[15px] font-semibold" style={{ color: palette.heading }}>
          {resultCount.toLocaleString()} {resultCount === 1 ? "user" : "users"}
        </Text>
        <AddUserButton onPress={onAddUser} />
      </View>
    </View>
  );
}
