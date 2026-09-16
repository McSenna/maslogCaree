import { View } from "react-native";

import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

import CompactDashboardSkeleton from "./skeleton/CompactDashboardSkeleton";
import { MetricSkeleton } from "./skeleton/skeletonPrimitives";
import WideDashboardSkeleton from "./skeleton/WideDashboardSkeleton";

type AdminDashboardSkeletonProps = {
  palette: AdminDashboardPalette;
  compact: boolean;
  metricColumns: 2 | 4;
  panelColumns: 1 | 2 | 3;
  gap: number;
};

const AdminDashboardSkeleton = ({
  palette,
  compact,
  metricColumns,
  panelColumns,
  gap,
}: AdminDashboardSkeletonProps) => {
  const metricCards =
    metricColumns === 4 ? (
      <View style={{ flexDirection: "row", gap }}>
        <MetricSkeleton palette={palette} />
        <MetricSkeleton palette={palette} />
        <MetricSkeleton palette={palette} />
        <MetricSkeleton palette={palette} />
      </View>
    ) : (
      <View style={{ gap }}>
        <View style={{ flexDirection: "row", gap }}>
          <MetricSkeleton palette={palette} />
          <MetricSkeleton palette={palette} />
        </View>
        <View style={{ flexDirection: "row", gap }}>
          <MetricSkeleton palette={palette} />
          <MetricSkeleton palette={palette} />
        </View>
      </View>
    );

  if (compact) {
    return <CompactDashboardSkeleton palette={palette} metricCards={metricCards} />;
  }

  return (
    <WideDashboardSkeleton
      palette={palette}
      metricCards={metricCards}
      panelColumns={panelColumns}
      gap={gap}
    />
  );
};

export default AdminDashboardSkeleton;
