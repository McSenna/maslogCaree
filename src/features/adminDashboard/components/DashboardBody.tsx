import { View } from "react-native";
import {
  ActivityTrendPanel,
  RecentActivitiesPanel,
  RecentUsersPanel,
  RegistrationTrendPanel,
  RoleDistributionPanel,
} from "@/components/dashboard/admin";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { AdminDashboardData } from "@/services/adminDashboardService";
import {
  donutSizeForPanel,
  LEGEND_BESIDE_MIN_WIDTH,
  USER_ROW_SINGLE_LINE_MIN_WIDTH,
} from "../constants/dashboardLayout";
import type { AdminDashboardLayout } from "../hooks/useAdminDashboardLayout";
import DashboardMetricGrid from "./DashboardMetricGrid";
import AnalyticsRow from "./dashboardBody/AnalyticsRow";
import DesktopPanelsGrid from "./dashboardBody/DesktopPanelsGrid";

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

const DashboardBody = ({
  data,
  palette,
  isDark,
  layout,
  recentUsers,
  recentActivities,
  onViewAllUsers,
  onViewAllActivities,
}: DashboardBodyProps) => {
  const { isMobile, gap, panelColumns, inColumns, analyticsSideBySide } = layout;

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

  const distributionStacked = layout.chartPanelWidth < LEGEND_BESIDE_MIN_WIDTH;

  const distributionPanel = (
    <RoleDistributionPanel
      palette={palette}
      distribution={data.roleDistribution ?? []}
      stacked={distributionStacked}
      size={distributionStacked ? 180 : donutSizeForPanel(layout.chartPanelWidth)}
      fill={inColumns}
    />
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

  const registrationPanel = (
    <RegistrationTrendPanel
      palette={palette}
      trend={data.registrationTrend ?? []}
      compact={isMobile}
      fill={analyticsSideBySide}
    />
  );

  const activityTrendPanel = (
    <ActivityTrendPanel
      palette={palette}
      trend={data.activityTrend ?? []}
      compact={isMobile}
      fill={analyticsSideBySide}
    />
  );

  const analyticsRow = (
    <AnalyticsRow
      registrationPanel={registrationPanel}
      activityTrendPanel={activityTrendPanel}
      sideBySide={analyticsSideBySide}
      gap={gap}
    />
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
      <DesktopPanelsGrid
        distributionPanel={distributionPanel}
        usersPanel={usersPanel}
        activitiesPanel={activitiesPanel}
        panelColumns={panelColumns}
        gap={gap}
      />
    </View>
  );
};

export default DashboardBody;
