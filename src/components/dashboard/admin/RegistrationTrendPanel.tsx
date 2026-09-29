import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import SegmentedControl, { type SegmentOption } from "@/components/dashboard/kit/SegmentedControl";
import SimpleBarChart from "@/components/ui/charts/SimpleBarChart";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import {
  expandMonth,
  formatMonthYear,
  isCurrentMonth,
  monthRangeLabel,
} from "@/features/adminDashboard/utils/dashboardAnalytics";
import type { TrendPoint } from "@/services/adminDashboardService";
import AnalyticsSummary, { type SummaryDelta } from "./analytics/AnalyticsSummary";
import HighlightStat from "./analytics/HighlightStat";
import EmptyPanelState from "./EmptyPanelState";
import PanelCard from "./PanelCard";

type RegistrationTrendPanelProps = {
  palette: AdminDashboardPalette;
  trend: TrendPoint[];
  compact?: boolean;
  fill?: boolean;
};

type MonthRange = "6" | "3";

// The API returns the last six months; the shorter range is a view over the same buckets.
const RANGE_OPTIONS: SegmentOption<MonthRange>[] = [
  { value: "3", label: "3 months" },
  { value: "6", label: "6 months" },
];

const accounts = (count: number) => `${count.toLocaleString()} new ${count === 1 ? "account" : "accounts"}`;

const monthOverMonth = (points: TrendPoint[], latestIsPartial: boolean): SummaryDelta | null => {
  if (points.length < 2) return null;
  const latest = points[points.length - 1];
  const previous = points[points.length - 2];
  const delta = latest.count - previous.count;
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const period = latestIsPartial ? `${latest.label} so far` : latest.label;
  return {
    direction,
    value: `${delta > 0 ? "+" : ""}${delta}`,
    comparison: `${period} vs ${previous.label}`,
    accessibilityLabel:
      delta === 0
        ? `${expandMonth(latest.label)}${latestIsPartial ? " so far" : ""}: same as ${expandMonth(previous.label)}`
        : `${expandMonth(latest.label)}${latestIsPartial ? " so far" : ""}: ${Math.abs(delta)} ${delta > 0 ? "more" : "fewer"} than ${expandMonth(previous.label)}`,
  };
};

const LegendSwatch = ({ palette, partial }: { palette: AdminDashboardPalette; partial?: boolean }) => (
  <View
    style={{
      width: 12,
      height: 12,
      borderRadius: 3,
      backgroundColor: partial ? palette.tones.blue.cardBg : palette.primary,
      borderWidth: partial ? 1.5 : 0,
      borderStyle: partial ? "dashed" : "solid",
      borderColor: palette.primary,
    }}
  />
);

const RegistrationTrendPanel = ({
  palette,
  trend,
  compact = false,
  fill = false,
}: RegistrationTrendPanelProps) => {
  const [range, setRange] = useState<MonthRange>("6");
  const points = useMemo(() => trend.slice(-Number(range)), [trend, range]);

  const total = points.reduce((sum, point) => sum + point.count, 0);
  const latest = points.length > 0 ? points[points.length - 1] : null;
  const latestIsPartial = latest ? isCurrentMonth(latest) : false;
  const rangeLabel = monthRangeLabel(points);

  const chartData = points.map((point) => ({
    label: point.label,
    value: point.count,
    partial: isCurrentMonth(point),
  }));

  const rangeFilter = (
    <SegmentedControl
      palette={palette}
      label="Registration period"
      value={range}
      options={RANGE_OPTIONS}
      onChange={setRange}
      fill={compact}
    />
  );

  return (
    <PanelCard
      palette={palette}
      title="User registrations"
      icon="user-plus"
      subtitle={`New accounts per month · ${rangeLabel}`}
      headerRight={compact ? undefined : rangeFilter}
      fill={fill}
    >
      {compact ? <View className="mb-3">{rangeFilter}</View> : null}

      <AnalyticsSummary
        palette={palette}
        value={total.toLocaleString()}
        accessibilityLabel={`${accounts(total)} from ${rangeLabel}`}
        delta={monthOverMonth(points, latestIsPartial)}
        aside={
          latest ? (
            <HighlightStat
              palette={palette}
              tone="blue"
              icon="calendar-month-outline"
              label={latestIsPartial ? "This month" : "Latest month"}
              value={formatMonthYear(latest)}
              meta={`${accounts(latest.count)}${latestIsPartial ? " so far" : ""}`}
            />
          ) : null
        }
      />

      {total === 0 ? (
        <EmptyPanelState
          palette={palette}
          icon="user-plus"
          message={`No new accounts were registered from ${rangeLabel}.`}
        />
      ) : (
        <View>
          <SimpleBarChart
            data={chartData}
            height={compact ? 200 : 180}
            accentColor={palette.primary}
            dimColor={palette.bannerArt}
            highlightPeak={false}
            showValues
            maxBarWidth={compact ? 36 : 56}
            radius={6}
            gridDashed
            tickColor={palette.muted}
            formatTooltip={(datum, index) => {
              const point = points[index];
              return {
                title: formatMonthYear(point),
                meta: `${datum.value.toLocaleString()} ${datum.value === 1 ? "registration" : "registrations"}${datum.partial ? " so far" : ""}`,
              };
            }}
          />

          <View
            className="mt-2 flex-row flex-wrap items-center"
            style={{ columnGap: 16, rowGap: 6 }}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <View className="flex-row items-center gap-1.5">
              <LegendSwatch palette={palette} />
              <Text className="text-[12px] font-medium" style={{ color: palette.muted }}>
                New accounts in a full month
              </Text>
            </View>
            {chartData.some((d) => d.partial) ? (
              <View className="flex-row items-center gap-1.5">
                <LegendSwatch palette={palette} partial />
                <Text className="text-[12px] font-medium" style={{ color: palette.muted }}>
                  Current month, to date
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      )}
    </PanelCard>
  );
};

export default RegistrationTrendPanel;
