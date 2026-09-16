import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import SimpleLineChart from "@/components/ui/charts/SimpleLineChart";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { TrendPoint } from "@/services/adminDashboardService";
import EmptyPanelState from "./EmptyPanelState";
import PanelCard from "./PanelCard";

type RegistrationTrendPanelProps = {
  palette: AdminDashboardPalette;
  trend: TrendPoint[];
  compact?: boolean;
  fill?: boolean;
};

const RegistrationTrendPanel = ({
  palette,
  trend,
  compact = false,
  fill = false,
}: RegistrationTrendPanelProps) => {
  const total = trend.reduce((sum, point) => sum + point.count, 0);
  const latest = trend.length > 0 ? trend[trend.length - 1].count : 0;
  const previous = trend.length > 1 ? trend[trend.length - 2].count : 0;
  const delta = latest - previous;
  const isUp = delta >= 0;
  const deltaColor = isUp ? palette.positive : palette.negative;

  const trendBadge =
    trend.length > 1 ? (
      <View
        className="flex-row items-center gap-1 rounded-full px-2.5 py-1"
        style={{ backgroundColor: palette.bannerBg }}
      >
        <Feather name={isUp ? "trending-up" : "trending-down"} size={12} color={deltaColor} />
        <Text className="text-[12px] font-semibold" style={{ color: deltaColor }}>
          {isUp ? "+" : ""}
          {delta}
        </Text>
        {!compact ? (
          <Text className="text-[12px] font-medium" style={{ color: palette.muted }}>
            vs last month
          </Text>
        ) : null}
      </View>
    ) : null;

  return (
    <PanelCard
      palette={palette}
      title="User Registrations"
      icon="user-plus"
      subtitle="New accounts · last 6 months"
      headerRight={trendBadge}
      fill={fill}
    >
      <View className="mb-4">
        <Text className="text-[28px] font-bold" style={{ color: palette.heading, lineHeight: 34 }}>
          {total.toLocaleString()}
        </Text>
      </View>

      {trend.length === 0 ? (
        <EmptyPanelState
          palette={palette}
          icon="user-plus"
          message="No registrations recorded yet."
        />
      ) : (
        <SimpleLineChart
          labels={trend.map((point) => point.label)}
          series={[
            { values: trend.map((point) => point.count), color: palette.primary, showArea: true },
          ]}
          height={compact ? 180 : 210}
          showLegend={false}
          formatTooltip={(index) => {
            const point = trend[index];
            return {
              title: point.label,
              meta: `${point.count} ${point.count === 1 ? "registration" : "registrations"}`,
            };
          }}
        />
      )}
    </PanelCard>
  );
};

export default RegistrationTrendPanel;
