import { View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { StaffDashboardData } from "@/services/staffDashboardService";
import type { RoleDashboardConfig } from "../config/roleDashboardConfig";
import type { StaffDashboardLayout } from "../hooks/useStaffDashboardLayout";
import ActivityTrendCard from "./ActivityTrendCard";
import QueuePreviewCard from "./QueuePreviewCard";
import RecentActivityCard from "./RecentActivityCard";
import ServiceSplitCard from "./ServiceSplitCard";
import StaffMetricGrid from "./StaffMetricGrid";
import ChartRow from "./staffDashboardBody/ChartRow";
import LowerPanels from "./staffDashboardBody/LowerPanels";
import WidePanels from "./staffDashboardBody/WidePanels";
import GridCell from "@/features/adminDashboard/components/GridCell";
import { buildUpcomingPanels } from "./staffDashboardBody/buildUpcomingPanels";

const StaffDashboardBody = ({
  palette,
  config,
  data,
  layout,
  onViewQueue,
}: {
  palette: AdminDashboardPalette;
  config: RoleDashboardConfig;
  data: StaffDashboardData;
  layout: StaffDashboardLayout;
  onViewQueue: () => void;
}) => {
  const { isMobile, gap, twoPanelRow, wideLayout, chartSideBySide } = layout;

  const showService = data.services.length > 1;

  const metrics = (
    <StaffMetricGrid
      palette={palette}
      metrics={config.metrics}
      data={data}
      columns={layout.metricColumns}
      gap={gap}
      compact={isMobile}
      dense={layout.denseMetrics}
    />
  );

  const trend = (
    <ActivityTrendCard
      palette={palette}
      config={config}
      services={data.services}
      trend={data.trend}
      compact={isMobile}
      fill={chartSideBySide}
    />
  );

  const split = config.showServiceSplit ? (
    <ServiceSplitCard palette={palette} breakdown={data.serviceBreakdown} fill={chartSideBySide} />
  ) : null;

  const queue = (
    <QueuePreviewCard
      palette={palette}
      queue={data.queue}
      showService={showService}
      limit={isMobile || wideLayout ? 4 : 5}
      onViewAll={onViewQueue}
      fill={wideLayout}
      dense={wideLayout}
    />
  );

  const activity = (
    <RecentActivityCard
      key="activity"
      palette={palette}
      activities={data.recentActivity}
      title={config.activityTitle}
      subtitle={config.activitySubtitle}
      showService={showService}
      limit={isMobile ? 4 : 5}
      fill={!isMobile}
    />
  );

  const upcomingPanels = buildUpcomingPanels({ palette, config, data, showService, isMobile, onViewQueue });

  const chartRow = <ChartRow trend={trend} split={split} twoPanelRow={chartSideBySide} gap={gap} />;

  if (isMobile) {
    return (
      <View style={{ gap }}>
        {metrics}
        {queue}
        {chartRow}
        {upcomingPanels}
        {activity}
      </View>
    );
  }

  if (wideLayout && !split) {
    // No service split (BHW): the queue takes the chart's side column instead of the chart
    // stretching across the page.
    return (
      <View style={{ gap }}>
        {metrics}
        <View style={{ flexDirection: "row", gap }}>
          <GridCell flex={2}>{trend}</GridCell>
          <GridCell flex={1}>{queue}</GridCell>
        </View>
        <View style={{ flexDirection: "row", gap }}>
          {[...upcomingPanels, activity].map((panel) => (
            <GridCell key={panel.key}>{panel}</GridCell>
          ))}
        </View>
      </View>
    );
  }

  if (wideLayout) {
    return (
      <View style={{ gap }}>
        {metrics}
        {chartRow}
        <WidePanels queue={queue} upcoming={upcomingPanels} activity={activity} gap={gap} />
      </View>
    );
  }

  const lowerPanels = [...upcomingPanels, activity];

  return (
    <View style={{ gap }}>
      {metrics}
      {chartRow}
      {queue}
      <LowerPanels panels={lowerPanels} twoPanelRow={twoPanelRow} gap={gap} />
    </View>
  );
};

export default StaffDashboardBody;
