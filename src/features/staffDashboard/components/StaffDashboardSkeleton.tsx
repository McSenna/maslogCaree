import type { ReactNode } from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";
import { DASHBOARD_RADIUS, type AdminDashboardPalette } from "@/design/adminDashboardTheme";

const PanelShell = ({
  palette,
  flex,
  children,
}: {
  palette: AdminDashboardPalette;
  flex?: number;
  children: ReactNode;
}) => {
  return (
    <View
      className="gap-3 border p-4"
      style={{
        flex,
        minWidth: 0,
        borderRadius: DASHBOARD_RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
      }}
    >
      {children}
    </View>
  );
};

const RowSkeleton = () => {
  return (
    <View className="flex-row items-center gap-3 py-2">
      <Skeleton style={{ width: 36, height: 36, borderRadius: 18 }} />
      <View className="min-w-0 flex-1 gap-1.5">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2.5 w-1/3" />
      </View>
      <Skeleton className="h-5 w-16" style={{ borderRadius: 999 }} />
    </View>
  );
};

const MetricSkeleton = ({ palette }: { palette: AdminDashboardPalette }) => {
  return (
    <PanelShell palette={palette} flex={1}>
      <Skeleton className="h-8 w-8" style={{ borderRadius: 10 }} />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-12" />
      <Skeleton className="h-2.5 w-24" />
    </PanelShell>
  );
};

const StaffDashboardSkeleton = ({
  palette,
  metricColumns,
  twoPanelRow,
  gap,
  showSplit,
}: {
  palette: AdminDashboardPalette;
  metricColumns: 2 | 4;
  twoPanelRow: boolean;
  gap: number;
  showSplit: boolean;
}) => {
  const metric = <MetricSkeleton palette={palette} />;

  const metrics =
    metricColumns === 4 ? (
      <View style={{ flexDirection: "row", gap }}>
        {metric}
        {metric}
        {metric}
        {metric}
      </View>
    ) : (
      <View style={{ gap }}>
        <View style={{ flexDirection: "row", gap }}>
          {metric}
          {metric}
        </View>
        <View style={{ flexDirection: "row", gap }}>
          {metric}
          {metric}
        </View>
      </View>
    );

  const chart = (
    <PanelShell palette={palette} flex={twoPanelRow ? 2 : undefined}>
      <Skeleton className="h-3.5 w-40" />
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-[180px] w-full" style={{ borderRadius: 12 }} />
    </PanelShell>
  );

  const split = (
    <PanelShell palette={palette} flex={twoPanelRow ? 1 : undefined}>
      <Skeleton className="h-3.5 w-32" />
      <Skeleton className="h-2 w-full" style={{ borderRadius: 999 }} />
      <Skeleton className="h-2 w-full" style={{ borderRadius: 999 }} />
    </PanelShell>
  );

  const list = (
    <PanelShell palette={palette}>
      <Skeleton className="h-3.5 w-36" />
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
    </PanelShell>
  );

  return (
    <View style={{ gap }}>
      {metrics}

      {showSplit && twoPanelRow ? (
        <View style={{ flexDirection: "row", gap }}>
          {chart}
          {split}
        </View>
      ) : (
        <View style={{ gap }}>
          {chart}
          {showSplit ? split : null}
        </View>
      )}

      {list}
      {list}
    </View>
  );
};

export default StaffDashboardSkeleton;
