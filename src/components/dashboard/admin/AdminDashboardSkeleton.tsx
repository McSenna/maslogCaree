import type { ReactNode } from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  DASHBOARD_CARD_SHADOW,
  DASHBOARD_RADIUS,
  type AdminDashboardPalette,
} from "@/design/adminDashboardTheme";

type AdminDashboardSkeletonProps = {
  palette: AdminDashboardPalette;
  compact: boolean;
  metricColumns: 2 | 4;
  panelColumns: 1 | 2 | 3;
  gap: number;
};

function PanelShell({
  palette,
  flex,
  children,
}: {
  palette: AdminDashboardPalette;
  flex?: number;
  children: ReactNode;
}) {
  return (
    <View
      className="gap-3 rounded-2xl border p-4"
      style={{
        flex,
        minWidth: 0,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
      }}
    >
      {children}
    </View>
  );
}

function RowSkeleton({ circle = 36 }: { circle?: number }) {
  return (
    <View className="flex-row items-center gap-3 py-2">
      <Skeleton style={{ width: circle, height: circle, borderRadius: circle / 2 }} />
      <View className="min-w-0 flex-1 gap-1.5">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-2.5 w-1/2" />
      </View>
    </View>
  );
}

/** Stands in for MetricCard, and must keep its shape: same radius, same 48px
 *  icon chip, and the same label / figure / caption stack. */
function MetricSkeleton({ palette }: { palette: AdminDashboardPalette }) {
  return (
    <View
      className="flex-row items-center gap-3.5 border p-4"
      style={{
        flex: 1,
        minWidth: 0,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        borderRadius: DASHBOARD_RADIUS.card,
        ...DASHBOARD_CARD_SHADOW,
      }}
    >
      <Skeleton style={{ width: 48, height: 48, borderRadius: 14 }} />
      <View className="min-w-0 flex-1 gap-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-2.5 w-20" />
      </View>
    </View>
  );
}

/**
 * Mirrors the real dashboard's structure so nothing jumps when data lands:
 * four metric cards in the same grid, then the panels, in the same order the
 * layout will use.
 */
export default function AdminDashboardSkeleton({
  palette,
  compact,
  metricColumns,
  panelColumns,
  gap,
}: AdminDashboardSkeletonProps) {
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

  const analyticsSkeleton = (flex?: number, height = 190) => (
    <PanelShell palette={palette} flex={flex}>
      <Skeleton className="h-3.5 w-36" />
      <Skeleton className="h-6 w-20" />
      <Skeleton style={{ height, width: "100%", borderRadius: 12 }} />
    </PanelShell>
  );

  if (compact) {
    return (
      <View className="gap-5">
        {metricCards}
        {analyticsSkeleton(undefined, 150)}
        {analyticsSkeleton(undefined, 150)}
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
  }

  const chartPanel = (
    <PanelShell palette={palette} flex={panelColumns === 1 ? undefined : 1}>
      <Skeleton className="h-3.5 w-40" />
      <View className="items-center py-2">
        <Skeleton style={{ width: 150, height: 150, borderRadius: 75 }} />
      </View>
    </PanelShell>
  );

  const usersPanel = (
    <PanelShell palette={palette} flex={panelColumns === 1 ? undefined : 1}>
      <Skeleton className="h-3.5 w-32" />
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
    </PanelShell>
  );

  const activitiesPanel = (
    <PanelShell palette={palette} flex={panelColumns === 3 ? 1 : undefined}>
      <Skeleton className="h-3.5 w-36" />
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
    </PanelShell>
  );

  if (panelColumns === 1) {
    return (
      <View className="gap-5">
        {metricCards}
        {analyticsSkeleton()}
        {analyticsSkeleton()}
        {chartPanel}
        {usersPanel}
        {activitiesPanel}
      </View>
    );
  }

  return (
    <View className="gap-5">
      {metricCards}
      <View style={{ flexDirection: "row", gap }}>
        {analyticsSkeleton(1.9)}
        {analyticsSkeleton(1)}
      </View>
      <View style={{ flexDirection: "row", gap }}>
        {chartPanel}
        {usersPanel}
        {panelColumns === 3 ? activitiesPanel : null}
      </View>
      {panelColumns === 2 ? activitiesPanel : null}
    </View>
  );
}
