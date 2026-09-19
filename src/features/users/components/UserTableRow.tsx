import { useState } from "react";
import { Pressable, Text, View } from "react-native";
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
    <View
      className="relative w-full flex-row items-center"
      style={{
        minHeight: 68,
        backgroundColor: background,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <Pressable
        onPress={onSelect}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${user.fullname}`}
        accessibilityState={{ selected: isSelected }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />

      <Cell width={USER_COLUMNS.checkbox} align="center" style={{ zIndex: 2 }}>
        <Checkbox
          checked={isChecked}
          onChange={onToggleCheck}
          accessibilityLabel={`Select ${user.fullname}`}
        />
      </Cell>

      <Cell flex={USER_COLUMNS.user} style={{ zIndex: 1 }}>
        <UserIdentityCell user={user} />
      </Cell>

      <Cell flex={USER_COLUMNS.email} style={{ zIndex: 1 }}>
        <Text className="text-[13px] font-medium" numberOfLines={1} style={{ color: palette.muted }}>
          {user.email}
        </Text>
      </Cell>

      <Cell flex={USER_COLUMNS.role} style={{ zIndex: 1 }}>
        <RoleBadge role={user.role} />
      </Cell>

      <Cell flex={USER_COLUMNS.platform} style={{ zIndex: 1 }}>
        <PlatformAccessBadge user={user} />
      </Cell>

      <Cell flex={USER_COLUMNS.location} style={{ zIndex: 1 }}>
        <Text className="text-[13px] font-medium" numberOfLines={2} style={{ color: palette.body }}>
          {user.address || "—"}
        </Text>
      </Cell>

      <Cell flex={USER_COLUMNS.status} style={{ zIndex: 1 }}>
        <UserStatusBadge status={user.status} compact />
      </Cell>

      <Cell flex={USER_COLUMNS.lastLogin} style={{ zIndex: 1 }}>
        <LastLoginCell lastLogin={user.lastLogin} />
      </Cell>
    </View>
  );
};

export default UserTableRow;
