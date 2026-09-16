import { useState } from "react";
import { Pressable, Text } from "react-native";
import type { AdminUser } from "@/features/users/services/userService";
import PlatformAccessBadge from "./PlatformAccessBadge";
import RoleBadge from "./RoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import Checkbox from "@/components/ui/Checkbox";
import Cell from "./userTableRow/Cell";
import LastLoginCell from "./userTableRow/LastLoginCell";
import UserIdentityCell from "./userTableRow/UserIdentityCell";
import { USER_COLUMNS } from "./usersTableColumns";
import { useUsersPalette } from "./usersTheme";

type UserTableRowProps = {
  user: AdminUser;
  isSelected: boolean;
  isChecked: boolean;
  onToggleCheck: (next: boolean) => void;
  onSelect: () => void;
  isLast: boolean;
};

const UserTableRow = ({
  user,
  isSelected,
  isChecked,
  onToggleCheck,
  onSelect,
  isLast,
}: UserTableRowProps) => {
  const palette = useUsersPalette();
  const [hovered, setHovered] = useState(false);

  const background = isSelected
    ? palette.rowSelected
    : hovered
      ? palette.subtleSurface
      : palette.cardBg;

  return (
    <Pressable
      onPress={onSelect}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${user.fullname}`}
      accessibilityState={{ selected: isSelected }}
      className="w-full flex-row items-center"
      style={{
        minHeight: 68,
        backgroundColor: background,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <Cell width={USER_COLUMNS.checkbox} align="center">
        <Checkbox
          checked={isChecked}
          onChange={onToggleCheck}
          accessibilityLabel={`Select ${user.fullname}`}
        />
      </Cell>

      <Cell flex={USER_COLUMNS.user}>
        <UserIdentityCell user={user} onSelect={onSelect} />
      </Cell>

      <Cell flex={USER_COLUMNS.email}>
        <Text className="text-[13px] font-medium" numberOfLines={1} style={{ color: palette.muted }}>
          {user.email}
        </Text>
      </Cell>

      <Cell flex={USER_COLUMNS.role}>
        <RoleBadge role={user.role} />
      </Cell>

      <Cell flex={USER_COLUMNS.platform}>
        <PlatformAccessBadge user={user} />
      </Cell>

      <Cell flex={USER_COLUMNS.location}>
        <Text className="text-[13px] font-medium" numberOfLines={2} style={{ color: palette.body }}>
          {user.address || "—"}
        </Text>
      </Cell>

      <Cell flex={USER_COLUMNS.status}>
        <UserStatusBadge status={user.status} compact />
      </Cell>

      <Cell flex={USER_COLUMNS.lastLogin}>
        <LastLoginCell lastLogin={user.lastLogin} />
      </Cell>
    </Pressable>
  );
};

export default UserTableRow;
