import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import SelectMenu, { type SelectOption } from "@/components/ui/SelectMenu";
import SimpleBarChart from "@/components/ui/charts/SimpleBarChart";
import SimpleLineChart from "@/components/ui/charts/SimpleLineChart";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { SERVICE_COLORS } from "@/design/serviceColors";
import { compareTrailingWindows } from "@/features/adminDashboard/utils/dashboardAnalytics";
import type { DashboardService, StaffTrendPoint } from "@/services/staffDashboardService";
import type { RoleDashboardConfig } from "../config/roleDashboardConfig";

type Range = "week" | "month";

const RANGE_OPTIONS: SelectOption<Range>[] = [
  { value: "week", label: "7 Days" },
  { value: "month", label: "30 Days" },
];

const RANGE_WINDOW: Record<Range, number> = { week: 7, month: 30 };
const RANGE_COMPARISON: Record<Range, string> = {
  week: "vs previous 7 days",
  month: "vs previous 30 days",
};

const shortDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const axisLabels = (points: StaffTrendPoint[], range: Range): string[] => {
  if (range === "week") return points.map((point) => point.label);
  const stride = Math.max(1, Math.ceil(points.length / 6));
  return points.map((point, index) => (index % stride === 0 ? shortDate(point.date) : ""));
};

const ActivityTrendCard = ({
  palette,
  config,
  services,
  trend,
  compact = false,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  config: RoleDashboardConfig;
  services: DashboardService[];
  trend: StaffTrendPoint[];
  compact?: boolean;
  fill?: boolean;
}) => {
  const [range, setRange] = useState<Range>("week");
  const size = RANGE_WINDOW[range];

  const window = useMemo(() => compareTrailingWindows(trend, size), [trend, size]);
  const points = useMemo(() => trend.slice(-size), [trend, size]);
  const labels = useMemo(() => axisLabels(points, range), [points, range]);

  const direction = window.trend.direction;
  const trendColor =
    direction === "up" ? palette.positive : direction === "down" ? palette.negative : palette.subtle;
  const trendIcon =
    direction === "up" ? "trending-up" : direction === "down" ? "trending-down" : "minus";
  const sign = direction === "up" ? "+" : direction === "down" ? "-" : "";

  const hasAny = points.some((point) => point.count > 0);

  return (
    <PanelCard
      palette={palette}
      title={config.chart.title}
      icon={config.chart.icon}
      subtitle={config.chart.subtitle}
      headerRight={
        <SelectMenu
          label="Date range"
          value={range}
          options={RANGE_OPTIONS}
          onChange={setRange}
          height={34}
          style={{ minWidth: 104 }}
        />
      }
      fill={fill}
    >
      <View className="mb-3">
        <Text className="text-[28px] font-bold" style={{ color: palette.heading, lineHeight: 34 }}>
          {window.currentTotal.toLocaleString()}
        </Text>
        <View className="mt-1 flex-row items-center gap-1.5">
          <Feather name={trendIcon} size={13} color={trendColor} />
          <Text className="text-[12.5px] font-bold" style={{ color: trendColor }}>
            {sign}
            {window.trend.percent}%
          </Text>
          <Text className="text-[12.5px] font-medium" style={{ color: palette.muted }}>
            {RANGE_COMPARISON[range]}
          </Text>
        </View>
      </View>

      {!hasAny ? (
        <EmptyPanelState
          palette={palette}
          icon={config.chart.icon}
          message="No completed visits in this period yet."
        />
      ) : config.chart.kind === "bars" ? (
        <SimpleBarChart
          data={points.map((point, index) => ({ label: labels[index], value: point.count }))}
          height={compact ? 170 : 200}
          accentColor={palette.primary}
          formatTooltip={(datum, index) => ({
            title: shortDate(points[index]?.date ?? ""),
            meta: `${datum.value} completed`,
          })}
        />
      ) : (
        <SimpleLineChart
          labels={labels}
          series={services.map((service) => ({
            values: points.map((point) => point.byService[service.key] ?? 0),
            color: SERVICE_COLORS[service.key] ?? palette.primary,
            label: service.label,
            showArea: services.length === 1,
          }))}
          height={compact ? 180 : 210}
          showLegend={services.length > 1}
          formatTooltip={(index) => {
            const point = points[index];
            return {
              title: shortDate(point.date),
              meta: services
                .map((s) => `${s.label}: ${point.byService[s.key] ?? 0}`)
                .join(" · "),
            };
          }}
        />
      )}
    </PanelCard>
  );
};

export default ActivityTrendCard;
