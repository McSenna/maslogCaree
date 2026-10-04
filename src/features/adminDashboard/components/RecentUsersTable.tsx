import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import DashboardRoleBadge from "@/components/dashboard/admin/DashboardRoleBadge";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import { DataTable, SegmentedControl, StatusPill, type TableColumn } from "@/components/dashboard/kit";
import UserAvatar from "@/components/ui/UserAvatar";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { DashboardUser } from "@/services/adminDashboardService";

import { newestFirst, type AccountGroup } from "../utils/newestAccounts";

type RoleGroup = AccountGroup;

const EMPTY_MESSAGES: Record<RoleGroup, string> = {
  all: "No accounts yet.",
  residents: "No resident accounts yet.",
  staff: "No staff accounts yet.",
};

const joinedLabel = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const UserCell = ({
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

const RecentUsersTable = ({
  palette,
  isDark,
  newest,
  totals,
  compact,
  onViewAll,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  isDark: boolean;
  /** Each filter's newest accounts, as the server sent them. */
  newest: Record<RoleGroup, DashboardUser[]>;
  /** Every account in each group, for the filter counts. */
  totals: Record<RoleGroup, number>;
  compact: boolean;
  onViewAll: () => void;
  fill?: boolean;
}) => {
  const [group, setGroup] = useState<RoleGroup>("all");

  // At most five, newest first, from the selected group's own newest accounts.
  const rows = useMemo(() => newestFirst(newest[group]), [newest, group]);

  const columns: TableColumn<DashboardUser>[] = [
    { key: "user", header: "User", flex: 2.4, render: (user) => <UserCell palette={palette} user={user} /> },
    {
      key: "role",
      header: "Role",
      width: 88,
      render: (user) => <DashboardRoleBadge role={user.role} palette={palette} isDark={isDark} />,
    },
    {
      key: "status",
      header: "Status",
      width: 88,
      minTableWidth: 470,
      render: (user) => (
        <StatusPill
          palette={palette}
          tone={user.verified ? "success" : "neutral"}
          label={user.verified ? "Active" : "Inactive"}
        />
      ),
    },
    {
      key: "joined",
      header: "Joined",
      width: 64,
      align: "right",
      minTableWidth: 390,
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

  const filter = (
    <SegmentedControl
      palette={palette}
      label="Show users"
      value={group}
      onChange={setGroup}
      fill={compact}
      options={[
        { value: "all", label: "All", count: totals.all },
        { value: "residents", label: "Residents", count: totals.residents },
        { value: "staff", label: "Staff", count: totals.staff },
      ]}
    />
  );

  return (
    <PanelCard
      palette={palette}
      title="Newest accounts"
      icon="user-plus"
      subtitle="Most recent sign-ups first"
      onViewAll={onViewAll}
      viewAllLabel="All users"
      headerRight={compact ? undefined : filter}
      fill={fill}
    >
      {compact ? <View className="mb-3">{filter}</View> : null}
      <DataTable
        palette={palette}
        caption="Newest accounts"
        columns={columns}
        rows={rows}
        rowKey={(user) => user._id}
        rowLabel={(user) =>
          `${user.fullname}, ${user.email}, ${user.role}, ${user.verified ? "active" : "inactive"}, joined ${joinedLabel(user.createdAt)}`
        }
        stacked={compact}
        renderStacked={(user) => (
          <>
            <UserCell palette={palette} user={user} size={36} />
            <View className="flex-row items-center gap-2" style={{ paddingLeft: 48 }}>
              <DashboardRoleBadge role={user.role} palette={palette} isDark={isDark} />
              <StatusPill
                palette={palette}
                tone={user.verified ? "success" : "neutral"}
                label={user.verified ? "Active" : "Inactive"}
              />
              <Text className="ml-auto text-[12px] font-medium" style={{ color: palette.subtle }}>
                {joinedLabel(user.createdAt)}
              </Text>
            </View>
          </>
        )}
        emptyIcon="users"
        emptyMessage={EMPTY_MESSAGES[group]}
      />
    </PanelCard>
  );
};

export default RecentUsersTable;
