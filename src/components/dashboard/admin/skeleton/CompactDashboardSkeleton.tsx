import { View } from "react-native";

import { Skeleton } from "@/components/ui/Skeleton";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

import { PanelShell, RowSkeleton } from "./skeletonPrimitives";
import { activitySkeleton, analyticsSkeleton } from "./skeletonPanels";

type Props = {
  palette: AdminDashboardPalette;
  metricCards: React.ReactNode;
};

const CompactDashboardSkeleton = ({ palette, metricCards }: Props) => {
  return (
    <View className="gap-5">
      {metricCards}
      {analyticsSkeleton(palette, undefined, 176)}
      {activitySkeleton(palette, undefined, 176)}
      <PanelShell palette={palette}>
        <Skeleton className="h-3.5 w-36" />
        <RowSkeleton />
        <RowSkeleton />
      </PanelShell>
      <PanelShell palette={palette}>
        <Skeleton className="h-3.5 w-32" />
        <RowSkeleton circle={38} />
        <RowSkeleton circle={38} />
        <RowSkeleton circle={38} />
      </PanelShell>
    </View>
  );
};

export default CompactDashboardSkeleton;
