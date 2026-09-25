import { useMemo, useState } from "react";
import { View } from "react-native";
import SelectMenu, { type SelectOption } from "@/components/ui/SelectMenu";
import SimpleBarChart from "@/components/ui/charts/SimpleBarChart";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import {
  compareTrailingWindows,
  expandWeekday,
  formatActivityCount,
  getBusiestPoint,
  type Trend,
} from "@/features/adminDashboard/utils/dashboardAnalytics";
import type { TrendPoint } from "@/services/adminDashboardService";
import AnalyticsSummary, { type SummaryDelta } from "./analytics/AnalyticsSummary";
import HighlightStat from "./analytics/HighlightStat";
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

const events = (count: number) => `${count.toLocaleString()} ${count === 1 ? "event" : "events"}`;

const periodDelta = (trend: Trend, comparison: string): SummaryDelta => {
  // A change that rounds to 0% reads as "no change", not as a green or red signal.
  const direction = trend.percent === 0 ? "flat" : trend.direction;
  const sign = direction === "up" ? "+" : direction === "down" ? "-" : "";
  return {
    direction,
    value: `${sign}${trend.percent}%`,
    comparison,
    accessibilityLabel:
      direction === "flat"
        ? `No change ${comparison}`
        : `${direction === "up" ? "Up" : "Down"} ${trend.percent} percent ${comparison}`,
  };
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
  const chartData = comparison.currentWindow.map((point) => ({ label: point.label, value: point.count }));

  const rangeFilter = (
    <SelectMenu
      label="Activity range"
      value={range}
      options={RANGE_OPTIONS}
      onChange={setRange}
      height={34}
      style={{ minWidth: 128 }}
    />
  );

  return (
    <PanelCard
      palette={palette}
      title="System Activity"
      icon="bar-chart-2"
      subtitle={`Events ${RANGE_NOUN[range]}`}
      headerRight={compact ? undefined : rangeFilter}
      fill={fill}
    >
      {/* On phones the filter gets its own line so the title and subtitle are never truncated. */}
      {compact ? <View className="mb-3 self-start">{rangeFilter}</View> : null}

      <AnalyticsSummary
        palette={palette}
        value={formatActivityCount(comparison.currentTotal)}
        accessibilityLabel={`${events(comparison.currentTotal)} ${RANGE_NOUN[range]}`}
        delta={periodDelta(comparison.trend, RANGE_COMPARISON[range])}
        aside={
          <HighlightStat
            palette={palette}
            tone="amber"
            icon="fire"
            label="Busiest day"
            value={busiest ? expandWeekday(busiest.label) : "—"}
            meta={busiest ? events(busiest.count) : "No activity yet"}
          />
        }
      />

      {!hasActivity ? (
        <EmptyPanelState
          palette={palette}
          icon="bar-chart-2"
          message="No activity recorded for this period."
        />
      ) : (
        <SimpleBarChart
          data={chartData}
          height={compact ? 176 : 196}
          accentColor={palette.primary}
          dimColor={palette.bannerArt}
          showLabels={chartData.length <= 10}
          gridDashed
          tickColor={palette.muted}
          formatTooltip={(d) => ({ title: expandWeekday(d.label), meta: events(d.value) })}
        />
      )}
    </PanelCard>
  );
};

export default ActivityTrendPanel;
