import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import SelectMenu, { type SelectOption } from "@/components/ui/SelectMenu";
import SimpleBarChart from "@/components/ui/charts/SimpleBarChart";
import type { AdminDashboardPalette, TrendDirection } from "@/design/adminDashboardTheme";
import {
  compareTrailingWindows,
  expandWeekday,
  formatActivityCount,
  getBusiestPoint,
} from "@/features/adminDashboard/utils/dashboardAnalytics";
import type { TrendPoint } from "@/services/adminDashboardService";
import BusiestDayCard from "./BusiestDayCard";
import EmptyPanelState from "./EmptyPanelState";
import PanelCard from "./PanelCard";

type ActivityTrendPanelProps = {
  palette: AdminDashboardPalette;
  trend: TrendPoint[];
  compact?: boolean;
  fill?: boolean;
};

type ActivityRange = "week" | "month";

const RANGE_OPTIONS: SelectOption<ActivityRange>[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "Last 30 Days" },
];

const RANGE_WINDOW: Record<ActivityRange, number> = { week: 7, month: 30 };
const RANGE_NOUN: Record<ActivityRange, string> = { week: "this week", month: "in the last 30 days" };
const RANGE_COMPARISON: Record<ActivityRange, string> = {
  week: "from last week",
  month: "from the previous 30 days",
};

const TrendLine = ({
  palette,
  direction,
  percent,
  comparisonLabel,
}: {
  palette: AdminDashboardPalette;
  direction: TrendDirection | "flat";
  percent: number;
  comparisonLabel: string;
}) => {
  const color =
    direction === "up" ? palette.positive : direction === "down" ? palette.negative : palette.subtle;
  const icon = direction === "up" ? "trending-up" : direction === "down" ? "trending-down" : "minus";
  const sign = direction === "up" ? "+" : direction === "down" ? "-" : "";

  return (
    <View className="mt-1.5 flex-row items-center gap-1.5">
      <Feather name={icon} size={13} color={color} />
      <Text className="text-[12.5px] font-bold" style={{ color }}>
        {sign}
        {percent}%
      </Text>
      <Text className="text-[12.5px] font-medium" style={{ color: palette.muted }}>
        {comparisonLabel}
      </Text>
    </View>
  );
};

const ActivityTrendPanel = ({
  palette,
  trend,
  compact = false,
  fill = false,
}: ActivityTrendPanelProps) => {
  const [range, setRange] = useState<ActivityRange>("week");
  const windowSize = RANGE_WINDOW[range];

  const comparison = useMemo(() => compareTrailingWindows(trend, windowSize), [trend, windowSize]);
  const busiest = useMemo(() => getBusiestPoint(comparison.currentWindow), [comparison.currentWindow]);

  const hasActivity = comparison.currentTotal > 0;
  const subtitle = busiest
    ? `Events ${RANGE_NOUN[range]} · busiest ${busiest.label}`
    : `Events ${RANGE_NOUN[range]}`;

  const chartData = comparison.currentWindow.map((point) => ({ label: point.label, value: point.count }));

  return (
    <PanelCard
      palette={palette}
      title="System Activity"
      icon="bar-chart-2"
      subtitle={subtitle}
      headerRight={
        <SelectMenu
          label="Activity range"
          value={range}
          options={RANGE_OPTIONS}
          onChange={setRange}
          height={34}
          style={{ minWidth: 128 }}
        />
      }
      fill={fill}
    >
      <View className={compact ? "mb-3 gap-3" : "mb-4 flex-row items-start justify-between gap-3"}>
        <View className="min-w-0">
          <Text className="text-[28px] font-bold" style={{ color: palette.heading, lineHeight: 34 }}>
            {formatActivityCount(comparison.currentTotal)}
          </Text>
          <TrendLine
            palette={palette}
            direction={comparison.trend.direction}
            percent={comparison.trend.percent}
            comparisonLabel={RANGE_COMPARISON[range]}
          />
        </View>
        <BusiestDayCard
          palette={palette}
          day={busiest ? expandWeekday(busiest.label) : null}
          compact={compact}
        />
      </View>

      {!hasActivity ? (
        <EmptyPanelState
          palette={palette}
          icon="bar-chart-2"
          message="No activity recorded for this period."
        />
      ) : (
        <SimpleBarChart
          data={chartData}
          height={compact ? 180 : 210}
          accentColor={palette.primary}
          dimColor={palette.bannerArt}
          showLabels={chartData.length <= 10}
          formatTooltip={(d) => ({
            title: d.label,
            meta: `${d.value.toLocaleString()} ${d.value === 1 ? "event" : "events"}`,
          })}
        />
      )}
    </PanelCard>
  );
};

export default ActivityTrendPanel;
