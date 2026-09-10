import { View } from "react-native";
import {
  ActivityTrendPanel,
  PanelCard,
  RecentActivitiesPanel,
  RecentUsersPanel,
  RegistrationTrendPanel,
  RoleDonutChart,
} from "@/components/dashboard/admin";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { DASHBOARD_BREAKPOINTS } from "@/design/adminDashboardTheme";
import type { AdminDashboardData } from "@/services/adminDashboardService";
import {
  LEGEND_BESIDE_MIN_WIDTH,
  PANEL_FLEX,
  USER_ROW_SINGLE_LINE_MIN_WIDTH,
} from "../constants/dashboardLayout";
import type { AdminDashboardLayout } from "../hooks/useAdminDashboardLayout";
import DashboardMetricGrid from "./DashboardMetricGrid";
import GridCell from "./GridCell";

type DashboardBodyProps = {
  data: AdminDashboardData;
  palette: AdminDashboardPalette;
  isDark: boolean;
  layout: AdminDashboardLayout;
  recentUsers: AdminDashboardData["recentUsers"];
  recentActivities: AdminDashboardData["recentActivities"];
  onViewAllUsers: () => void;
  onViewAllActivities: () => void;
};

/**
 * The dashboard's panels, arranged for the width available.
 *
 * Mobile runs a different order from desktop — metrics, analytics, activities,
 * users, distribution — because a phone reader wants the feed before the
 * breakdown, not a donut chart above the fold.
 */
export default function DashboardBody({
  data,
  palette,
  isDark,
  layout,
  recentUsers,
  recentActivities,
  onViewAllUsers,
  onViewAllActivities,
}: DashboardBodyProps) {
  const { isMobile, gap, panelColumns, inColumns, availableWidth } = layout;

  const metricGrid = (
    <DashboardMetricGrid
      metrics={data.metrics}
      palette={palette}
      columns={layout.metricColumns}
      gap={gap}
      compact={isMobile}
      dense={layout.denseMetrics}
    />
  );

  const distributionPanel = (
    // centerContent: this panel is stretched to the row's tallest card but
    // holds a single visual, so its content is centred in that height rather
    // than pinned to the top above a gap.
    <PanelCard palette={palette} title="User Distribution by Role" fill={inColumns} centerContent>
      <RoleDonutChart
        palette={palette}
        distribution={data.roleDistribution ?? []}
        stacked={isMobile || layout.chartPanelWidth < LEGEND_BESIDE_MIN_WIDTH}
        size={isMobile ? 180 : layout.chartPanelWidth >= 420 ? 180 : 160}
      />
    </PanelCard>
  );

  const usersPanel = (
    <RecentUsersPanel
      palette={palette}
      isDark={isDark}
      users={recentUsers}
      compact={isMobile || layout.usersPanelWidth < USER_ROW_SINGLE_LINE_MIN_WIDTH}
      onViewAll={onViewAllUsers}
      fill={inColumns}
    />
  );

  const activitiesPanel = (
    <RecentActivitiesPanel
      palette={palette}
      activities={recentActivities}
      compact={isMobile}
      onViewAll={onViewAllActivities}
      fill={panelColumns === 3}
    />
  );

  /**
   * Analytics row: the registration line takes roughly two thirds against the
   * weekly activity bars. Below the two-panel threshold the pair stacks, since
   * a 7-bar chart in half of a narrow column is unreadable.
   */
  const registrationPanel = (
    <RegistrationTrendPanel
      palette={palette}
      trend={data.registrationTrend ?? []}
      compact={isMobile}
      fill={!isMobile}
    />
  );

  const activityTrendPanel = (
    <ActivityTrendPanel
      palette={palette}
      trend={data.activityTrend ?? []}
      compact={isMobile}
      fill={!isMobile}
    />
  );

  const analyticsRow =
    !isMobile && availableWidth >= DASHBOARD_BREAKPOINTS.twoPanelColumns ? (
      <View style={{ flexDirection: "row", gap }}>
        <GridCell flex={1.9}>{registrationPanel}</GridCell>
        <GridCell flex={1}>{activityTrendPanel}</GridCell>
      </View>
    ) : (
      <View style={{ gap }}>
        {registrationPanel}
        {activityTrendPanel}
      </View>
    );

  if (isMobile) {
    return (
      <View className="gap-4">
        {metricGrid}
        {analyticsRow}
        {activitiesPanel}
        {usersPanel}
        {distributionPanel}
      </View>
    );
  }

  return (
    <View className="gap-5">
      {metricGrid}
      {analyticsRow}

      {panelColumns === 1 ? (
        <View className="gap-5">
          {distributionPanel}
          {usersPanel}
          {activitiesPanel}
        </View>
      ) : (
        <View className="gap-5">
          <View style={{ flexDirection: "row", gap }}>
            <GridCell flex={PANEL_FLEX.distribution}>{distributionPanel}</GridCell>
            <GridCell flex={PANEL_FLEX.users}>{usersPanel}</GridCell>
            {panelColumns === 3 ? (
              <GridCell flex={PANEL_FLEX.activities}>{activitiesPanel}</GridCell>
            ) : null}
          </View>
          {/* Two columns cannot hold the activity rows legibly, so the feed
              runs full width underneath instead. */}
          {panelColumns === 2 ? activitiesPanel : null}
        </View>
      )}
    </View>
  );
}
