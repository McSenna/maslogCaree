import { View } from "react-native";

import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { ANALYTICS_FLEX } from "@/features/adminDashboard/constants/dashboardLayout";

import {
  activitiesPanel,
  activitySkeleton,
  analyticsSkeleton,
  chartPanel,
  usersPanel,
} from "./skeletonPanels";

type Props = {
  palette: AdminDashboardPalette;
  metricCards: React.ReactNode;
  panelColumns: 1 | 2 | 3;
  analyticsSideBySide: boolean;
  gap: number;
};

const WideDashboardSkeleton = ({
  palette,
  metricCards,
  panelColumns,
  analyticsSideBySide,
  gap,
}: Props) => {
  const chart = chartPanel(palette, panelColumns === 1 ? undefined : 1);
  const users = usersPanel(palette, panelColumns === 1 ? undefined : 1);
  const activities = activitiesPanel(palette, panelColumns === 3 ? 1 : undefined);

  if (panelColumns === 1) {
    return (
      <View className="gap-5">
        {metricCards}
        {analyticsSkeleton(palette)}
        {activitySkeleton(palette)}
        {chart}
        {users}
        {activities}
      </View>
    );
  }

  return (
    <View className="gap-5">
      {metricCards}
      {analyticsSideBySide ? (
        <View style={{ flexDirection: "row", gap }}>
          {analyticsSkeleton(palette, ANALYTICS_FLEX.registrations)}
          {activitySkeleton(palette, ANALYTICS_FLEX.activity)}
        </View>
      ) : (
        <View style={{ gap }}>
          {analyticsSkeleton(palette)}
          {activitySkeleton(palette)}
        </View>
      )}
      <View style={{ flexDirection: "row", gap }}>
        {chart}
        {users}
        {panelColumns === 3 ? activities : null}
      </View>
      {panelColumns === 2 ? activities : null}
    </View>
  );
};

export default WideDashboardSkeleton;
