import { Text, View } from "react-native";
import type { UserAction } from "@/components/dashboard/admin/UserActionsMenu";
import type { AdminUser } from "@/services/userService";
import Checkbox from "./Checkbox";
import UserTableRow from "./UserTableRow";
import { USER_COLUMNS } from "./usersTableColumns";
import { useUsersPalette } from "./usersTheme";

const HEADERS: { label: string; flex?: number; width?: number }[] = [
  { label: "User", flex: USER_COLUMNS.user },
  { label: "Email", flex: USER_COLUMNS.email },
  { label: "Role", flex: USER_COLUMNS.role },
  { label: "Platform Access", flex: USER_COLUMNS.platform },
  { label: "Location / Department", flex: USER_COLUMNS.location },
  { label: "Status", flex: USER_COLUMNS.status },
  { label: "Last Login", flex: USER_COLUMNS.lastLogin },
];

type UsersTableProps = {
  users: AdminUser[];
  selectedUserId: string | null;
  onSelectUser: (user: AdminUser) => void;
  checkedIds: ReadonlySet<string>;
  onToggleUser: (userId: string, next: boolean) => void;
  onToggleAll: (next: boolean) => void;
  buildActions: (user: AdminUser) => UserAction[];
};

export default function UsersTable({
  users,
  selectedUserId,
  onSelectUser,
  checkedIds,
  onToggleUser,
  onToggleAll,
  buildActions,
}: UsersTableProps) {
  const palette = useUsersPalette();

  const checkedOnPage = users.filter((u) => checkedIds.has(u._id)).length;
  const allChecked = users.length > 0 && checkedOnPage === users.length;
  const someChecked = checkedOnPage > 0 && !allChecked;

  return (
    <View className="w-full">
      {/* Header — deliberately light: a dark strip would fight the metric cards
          for attention on a page that is mostly table. */}
      <View
        className="w-full flex-row items-center"
        style={{
          height: 44,
          borderBottomWidth: 1,
          borderBottomColor: palette.divider,
        }}
      >
        <View className="items-center justify-center px-3" style={{ width: USER_COLUMNS.checkbox }}>
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked}
            onChange={onToggleAll}
            accessibilityLabel="Select all users on this page"
          />
        </View>

        {HEADERS.map((col) => (
          <View key={col.label} className="justify-center px-3" style={{ flex: col.flex, minWidth: 0 }}>
            <Text className="text-[12px] font-semibold" numberOfLines={1} style={{ color: palette.muted }}>
              {col.label}
            </Text>
          </View>
        ))}

        <View className="justify-center px-3" style={{ width: USER_COLUMNS.actions }}>
          <Text className="text-[12px] font-semibold" style={{ color: palette.muted }}>
            Actions
          </Text>
        </View>
      </View>

      {users.map((user, index) => (
        <UserTableRow
          key={user._id}
          user={user}
          isSelected={selectedUserId === user._id}
          isChecked={checkedIds.has(user._id)}
          onToggleCheck={(next) => onToggleUser(user._id, next)}
          onSelect={() => onSelectUser(user)}
          actions={buildActions(user)}
          isLast={index === users.length - 1}
        />
      ))}
    </View>
  );
}
