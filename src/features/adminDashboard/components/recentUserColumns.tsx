import { Text, View } from "react-native";

import { Badge, type Column } from "@/components/data-table";
import DashboardRoleBadge from "@/components/dashboard/admin/DashboardRoleBadge";
import UserAvatar from "@/components/ui/UserAvatar";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { DashboardUser } from "@/services/adminDashboardService";

export const joinedLabel = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

/** Verified accounts are active; colour, icon and word. */
export const AccountBadge = ({ verified }: { verified: boolean }) =>
  verified ? (
    <Badge tone="success" icon="check-circle" label="Active" spokenAs="Account status" />
  ) : (
    <Badge tone="danger" icon="x-circle" label="Inactive" spokenAs="Account status" />
  );

export const UserCell = ({
  palette,
  user,
  size = 32,
}: {
  palette: AdminDashboardPalette;
  user: DashboardUser;
  size?: number;
}) => (
  <View className="min-w-0 flex-row items-center gap-3" style={{ alignSelf: "stretch" }}>
    <UserAvatar
      size={size}
      imageUrl={user.profilePhoto}
      accessibilityLabel=""
      fallbackBackgroundColor={palette.divider}
      fallbackIconColor={palette.subtle}
    />
    <View className="min-w-0 flex-1">
      <Text className="text-[13.5px] font-semibold" numberOfLines={1} style={{ color: palette.heading }}>
        {user.fullname}
      </Text>
      <Text className="text-[12px]" numberOfLines={1} style={{ color: palette.muted }}>
        {user.email}
      </Text>
    </View>
  </View>
);

/** Newest accounts, declared once for the header, rows and skeleton. */
export const recentUserColumns = ({
  palette,
  isDark,
}: {
  palette: AdminDashboardPalette;
  isDark: boolean;
}): Column<DashboardUser>[] => [
  {
    key: "user",
    header: "User",
    flex: 2.4,
    minWidth: 200,
    render: (user) => <UserCell palette={palette} user={user} />,
  },
  {
    key: "role",
    header: "Role",
    width: 120,
    render: (user) => <DashboardRoleBadge role={user.role} palette={palette} isDark={isDark} />,
  },
  {
    key: "status",
    header: "Status",
    width: 120,
    hideBelow: "lg",
    render: (user) => <AccountBadge verified={user.verified} />,
  },
  {
    key: "joined",
    header: "Joined",
    width: 96,
    align: "right",
    hideBelow: "md",
    render: (user) => (
      <Text
        className="text-[12.5px] font-medium"
        numberOfLines={1}
        style={{ color: palette.muted, fontVariant: ["tabular-nums"] }}
      >
        {joinedLabel(user.createdAt)}
      </Text>
    ),
  },
];
