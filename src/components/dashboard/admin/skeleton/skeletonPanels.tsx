import { View } from "react-native";

import { Skeleton } from "@/components/ui/Skeleton";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

import { PanelShell, RowSkeleton } from "./skeletonPrimitives";

export const analyticsSkeleton = (
  palette: AdminDashboardPalette,
  flex?: number,
  height = 190
) => (
  <PanelShell palette={palette} flex={flex}>
    <Skeleton className="h-3.5 w-36" />
    <Skeleton className="h-6 w-20" />
    <Skeleton style={{ height, width: "100%", borderRadius: 12 }} />
  </PanelShell>
);

export const activitySkeleton = (
  palette: AdminDashboardPalette,
  flex?: number,
  height = 190
) => (
  <PanelShell palette={palette} flex={flex}>
    <View className="flex-row items-center justify-between gap-3">
      <View className="flex-row items-center gap-2.5">
        <Skeleton style={{ width: 36, height: 36, borderRadius: 12 }} />
        <Skeleton className="h-3.5 w-28" />
      </View>
      <Skeleton style={{ width: 90, height: 30, borderRadius: 10 }} />
    </View>
    <Skeleton className="h-6 w-20" />
    <Skeleton style={{ height, width: "100%", borderRadius: 12 }} />
  </PanelShell>
);

export const chartPanel = (palette: AdminDashboardPalette, flex?: number) => (
  <PanelShell palette={palette} flex={flex}>
    <View className="flex-row items-center justify-between gap-3">
      <View className="flex-row items-center gap-2.5">
        <Skeleton style={{ width: 36, height: 36, borderRadius: 12 }} />
        <Skeleton className="h-3.5 w-32" />
      </View>
      <Skeleton style={{ width: 78, height: 30, borderRadius: 10 }} />
    </View>
    <View className="items-center py-2">
      <Skeleton style={{ width: 150, height: 150, borderRadius: 75 }} />
    </View>
  </PanelShell>
);

export const usersPanel = (palette: AdminDashboardPalette, flex?: number) => (
  <PanelShell palette={palette} flex={flex}>
    <Skeleton className="h-3.5 w-32" />
    <RowSkeleton />
    <RowSkeleton />
    <RowSkeleton />
  </PanelShell>
);

export const activitiesPanel = (palette: AdminDashboardPalette, flex?: number) => (
  <PanelShell palette={palette} flex={flex}>
    <Skeleton className="h-3.5 w-36" />
    <RowSkeleton />
    <RowSkeleton />
    <RowSkeleton />
  </PanelShell>
);
