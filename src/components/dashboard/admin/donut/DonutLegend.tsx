import { Text, View } from "react-native";

import { ROLE_COLORS, type AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { calculatePercentage } from "@/features/adminDashboard/utils/dashboardAnalytics";
import type { RoleDistributionEntry } from "@/services/adminDashboardService";

import { DIMMED_OPACITY } from "./donutSegments";
import type { RoleFilter } from "./donutSegments.types";

type Props = {
  distribution: RoleDistributionEntry[];
  total: number;
  activeRole: RoleFilter;
  palette: AdminDashboardPalette;
  horizontal: boolean;
};

const DonutLegend = ({
  distribution,
  total,
  activeRole,
  palette,
  horizontal,
}: Props) => {
  return (
    <View className={horizontal ? "min-w-0 flex-1 gap-2" : "w-full gap-2"}>
      {distribution.map((entry) => {
        const percent = calculatePercentage(entry.count, total);
        const isDimmed = activeRole !== "all" && entry.role !== activeRole;
        const color = ROLE_COLORS[entry.role] ?? palette.primary;

        return (
          <View
            key={entry.role}
            accessibilityRole="text"
            accessibilityLabel={`${entry.label}: ${entry.count}, ${percent} percent`}
            className="flex-row items-center gap-2 rounded-xl px-2.5 py-2.5"
            style={{
              backgroundColor: palette.divider,
              opacity: isDimmed ? DIMMED_OPACITY : 1,
            }}
          >
            <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <Text
              className="min-w-0 flex-1 text-[13px] font-medium"
              numberOfLines={1}
              style={{ color: palette.body }}
            >
              {entry.label}
            </Text>
            <Text
              className="text-[13px] font-bold tabular-nums"
              style={{ color: palette.heading }}
            >
              {percent}%
            </Text>
            <Text
              className="text-right text-[12px] font-medium tabular-nums"
              style={{ color: palette.subtle, minWidth: 24 }}
            >
              {entry.count}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default DonutLegend;
