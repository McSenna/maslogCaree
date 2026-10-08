import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import DashboardRoleBadge from "@/components/dashboard/admin/DashboardRoleBadge";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import { DataTable } from "@/components/data-table";
import { SegmentedControl } from "@/components/dashboard/kit";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { DashboardUser } from "@/services/adminDashboardService";

import { newestFirst, type AccountGroup } from "../utils/newestAccounts";
import { AccountBadge, joinedLabel, recentUserColumns, UserCell } from "./recentUserColumns";

type RoleGroup = AccountGroup;

const EMPTY_MESSAGES: Record<RoleGroup, string> = {
  all: "No accounts yet.",
  residents: "No resident accounts yet.",
  staff: "No staff accounts yet.",
};

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

  const columns = recentUserColumns({ palette, isDark });

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
        caption="Newest accounts"
        surface="plain"
        density="compact"
        layout={compact ? "cards" : "auto"}
        columns={columns}
        data={rows}
        rowKey={(user) => user._id}
        rowLabel={(user) =>
          `${user.fullname}, ${user.email}, ${user.role}, ${user.verified ? "active" : "inactive"}, joined ${joinedLabel(user.createdAt)}`
        }
        renderMobileCard={(user) => (
          <>
            <UserCell palette={palette} user={user} size={36} />
            <View className="flex-row items-center gap-2" style={{ paddingLeft: 48 }}>
              <DashboardRoleBadge role={user.role} palette={palette} isDark={isDark} />
              <AccountBadge verified={user.verified} />
              <Text className="ml-auto text-[12px] font-medium" style={{ color: palette.subtle }}>
                {joinedLabel(user.createdAt)}
              </Text>
            </View>
          </>
        )}
        emptyIcon="users"
        emptyTitle={EMPTY_MESSAGES[group]}
      />
    </PanelCard>
  );
};

export default RecentUsersTable;
