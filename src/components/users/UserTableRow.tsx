import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import UserAvatar from "@/components/ui/UserAvatar";
import UserActionsMenu, { type UserAction } from "@/components/dashboard/admin/UserActionsMenu";
import type { AdminUser } from "@/services/userService";
import { formatDateTime } from "@/utils/dateFormatter";
import Checkbox from "./Checkbox";
import PlatformAccessBadge from "./PlatformAccessBadge";
import RoleBadge from "./RoleBadge";
import UserStatusBadge from "./UserStatusBadge";
import { USER_COLUMNS } from "./usersTableColumns";
import { useUsersPalette } from "./usersTheme";

type UserTableRowProps = {
  user: AdminUser;
  isSelected: boolean;
  isChecked: boolean;
  onToggleCheck: (next: boolean) => void;
  onSelect: () => void;
  actions: UserAction[];
  /** The last row drops its divider so it cannot double up with the card edge. */
  isLast: boolean;
};

function Cell({
  children,
  flex,
  width,
  align = "flex-start",
}: {
  children: React.ReactNode;
  flex?: number;
  width?: number;
  align?: "flex-start" | "center";
}) {
  return (
    <View
      className="justify-center px-3"
      style={{ flex, width, minWidth: 0, alignItems: align === "center" ? "center" : undefined }}
    >
      {children}
    </View>
  );
}

export default function UserTableRow({
  user,
  isSelected,
  isChecked,
  onToggleCheck,
  onSelect,
  actions,
  isLast,
}: UserTableRowProps) {
  const palette = useUsersPalette();
  const [hovered, setHovered] = useState(false);
  const [nameHovered, setNameHovered] = useState(false);

  const lastLogin = formatDateTime(user.lastLogin);
  const hasLoggedIn = Boolean(user.lastLogin);

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

      {/* User — the name is the row's stated affordance for opening details.
          The whole row stays pressable so a click anywhere still works, but the
          name is what carries the hover, so an admin can see where to aim. */}
      <Cell flex={USER_COLUMNS.user}>
        <View className="flex-row items-center gap-2.5">
          <UserAvatar
            size={40}
            imageUrl={user.profilePhoto}
            accessibilityLabel={`${user.fullname} profile photo`}
            fallbackBackgroundColor={palette.primary}
          />
          <Pressable
            onPress={onSelect}
            onPointerEnter={() => setNameHovered(true)}
            onPointerLeave={() => setNameHovered(false)}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${user.fullname}`}
            className="min-w-0 flex-1"
          >
            <Text
              className="text-[14px] font-bold"
              numberOfLines={1}
              style={{
                color: nameHovered ? palette.primary : palette.heading,
                textDecorationLine: nameHovered ? "underline" : "none",
              }}
            >
              {user.fullname}
            </Text>
          </Pressable>
        </View>
      </Cell>

      {/* Email */}
      <Cell flex={USER_COLUMNS.email}>
        <Text className="text-[13px] font-medium" numberOfLines={1} style={{ color: palette.muted }}>
          {user.email}
        </Text>
      </Cell>

      {/* Role */}
      <Cell flex={USER_COLUMNS.role}>
        <RoleBadge role={user.role} />
      </Cell>

      {/* Platform Access — which clients this role may sign in from. */}
      <Cell flex={USER_COLUMNS.platform}>
        <PlatformAccessBadge user={user} />
      </Cell>

      {/* Location / Department */}
      <Cell flex={USER_COLUMNS.location}>
        <Text className="text-[13px] font-medium" numberOfLines={2} style={{ color: palette.body }}>
          {user.address || "—"}
        </Text>
      </Cell>

      {/* Status */}
      <Cell flex={USER_COLUMNS.status}>
        <UserStatusBadge status={user.status} compact />
      </Cell>

      {/* Last Login */}
      <Cell flex={USER_COLUMNS.lastLogin}>
        {hasLoggedIn ? (
          <>
            <Text className="text-[13px] font-medium" style={{ color: palette.body }}>
              {lastLogin.date}
            </Text>
            <Text className="mt-0.5 text-[12px]" style={{ color: palette.subtle }}>
              {lastLogin.time}
            </Text>
          </>
        ) : (
          <Text className="text-[13px] font-medium" style={{ color: palette.subtle }}>
            Never
          </Text>
        )}
      </Cell>

      {/* Actions */}
      <Cell width={USER_COLUMNS.actions} align="center">
        <UserActionsMenu
          palette={palette}
          actions={actions}
          accessibilityLabel={`Actions for ${user.fullname}`}
        />
      </Cell>
    </Pressable>
  );
}
