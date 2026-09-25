import { View } from "react-native";

import { Skeleton } from "@/components/ui/Skeleton";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

import { PanelShell, RowSkeleton } from "./skeletonPrimitives";

/** Mirrors an analytics card: header, headline number with change chip, highlight tile, chart. */
const analyticsCardSkeleton = (
  palette: AdminDashboardPalette,
  { flex, chartHeight, withFilter }: { flex?: number; chartHeight: number; withFilter: boolean }
) => (
  <PanelShell palette={palette} flex={flex}>
    <View className="flex-row items-center justify-between gap-3">
      <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
        <Skeleton style={{ width: 36, height: 36, borderRadius: 12 }} />
        <View className="min-w-0 flex-1 gap-1.5">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-2.5 w-40 max-w-full" />
        </View>
      </View>
      {withFilter ? <Skeleton style={{ width: 128, height: 34, borderRadius: 10 }} /> : null}
    </View>
    <View className="flex-row flex-wrap items-center justify-between" style={{ columnGap: 16, rowGap: 12 }}>
      <View className="gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-32" />
      </View>
      <Skeleton style={{ width: 150, height: 56, borderRadius: 12 }} />
    </View>
    <Skeleton style={{ height: chartHeight, width: "100%", borderRadius: 12 }} />
  </PanelShell>
);

export const analyticsSkeleton = (palette: AdminDashboardPalette, flex?: number, chartHeight = 196) =>
  analyticsCardSkeleton(palette, { flex, chartHeight, withFilter: false });

export const activitySkeleton = (palette: AdminDashboardPalette, flex?: number, chartHeight = 196) =>
  analyticsCardSkeleton(palette, { flex, chartHeight, withFilter: true });

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
