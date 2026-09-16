import { useMemo, useState } from "react";
import { Animated, View } from "react-native";

import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { chartLegendGap } from "@/features/adminDashboard/constants/dashboardLayout";
import { useMountProgress } from "@/hooks/useMountProgress";
import type { DashboardRole, RoleDistributionEntry } from "@/services/adminDashboardService";

import EmptyPanelState from "./EmptyPanelState";
import DonutLegend from "./donut/DonutLegend";
import DonutRings from "./donut/DonutRings";
import { resolveDonutGeometry, useDonutSegments } from "./donut/donutSegments";
import type { RoleFilter } from "./donut/donutSegments.types";

export type { RoleFilter } from "./donut/donutSegments.types";


type RoleDonutChartProps = {
  palette: AdminDashboardPalette;
  distribution: RoleDistributionEntry[];
  stacked?: boolean;
  size?: number;
  activeRole?: RoleFilter;
};

const RoleDonutChart = ({
  palette,
  distribution,
  stacked = false,
  size = 168,
  activeRole = "all",
}: RoleDonutChartProps) => {
  const horizontal = !stacked;

  const total = useMemo(
    () => distribution.reduce((sum, entry) => sum + (entry.count || 0), 0),
    [distribution]
  );

  const geometry = resolveDonutGeometry(size);

  const mountKey = useMemo(
    () => distribution.map((e) => `${e.role}:${e.count}`).join(","),
    [distribution]
  );
  const progress = useMountProgress(650, mountKey);

  const [pressedRole, setPressedRole] = useState<DashboardRole | null>(null);

  const segments = useDonutSegments({
    distribution,
    total,
    circumference: geometry.circumference,
    gap: geometry.gap,
    center: geometry.center,
    radius: geometry.radius,
    palette,
  });

  if (total <= 0) {
    return <EmptyPanelState palette={palette} icon="users" message="No registered users yet." />;
  }

  const activeEntry = activeRole !== "all" ? segments.find((s) => s.role === activeRole) : null;
  const pressedEntry = pressedRole ? segments.find((s) => s.role === pressedRole) : null;

  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [
          { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
        ],
        flexDirection: horizontal ? "row" : "column",
        gap: horizontal ? chartLegendGap(size) : 20,
      }}
      className="items-center"
    >
      <DonutRings
        size={size}
        segments={segments}
        geometry={geometry}
        palette={palette}
        activeRole={activeRole}
        pressedRole={pressedRole}
        progress={progress}
        centerCount={activeEntry ? activeEntry.count : total}
        centerLabel={activeEntry ? activeEntry.label : "Total Users"}
        centerLabelColor={activeEntry ? activeEntry.color : palette.muted}
        pressedEntry={pressedEntry ?? null}
        onShowTooltip={setPressedRole}
        onHideTooltip={() => setPressedRole(null)}
      />

      {horizontal ? (
        <View style={{ width: 1, alignSelf: "stretch", backgroundColor: palette.divider }} />
      ) : null}

      <DonutLegend
        distribution={distribution}
        total={total}
        activeRole={activeRole}
        palette={palette}
        horizontal={horizontal}
      />
    </Animated.View>
  );
};

export default RoleDonutChart;
