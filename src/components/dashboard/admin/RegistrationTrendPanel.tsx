import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import SegmentedControl, { type SegmentOption } from "@/components/dashboard/kit/SegmentedControl";
import SimpleLineChart from "@/components/ui/charts/SimpleLineChart";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import {
  expandMonth,
  formatMonthYear,
  isCurrentMonth,
  monthRangeLabel,
} from "@/features/adminDashboard/utils/dashboardAnalytics";
import type { TrendPoint } from "@/services/adminDashboardService";
import AnalyticsSummary, { type SummaryDelta } from "./analytics/AnalyticsSummary";
import InlineStat from "./analytics/InlineStat";
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
            <InlineStat
              palette={palette}
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
          {/* One series, so no legend box: the panel title names it. */}
          <SimpleLineChart
            labels={chartData.map((point) => point.label)}
            series={[
              {
                values: chartData.map((point) => point.value),
                color: palette.primary,
                showArea: true,
                label: "New accounts",
              },
            ]}
            height={compact ? 196 : 208}
            showDots
            showLegend={false}
            gridDashed
            emphasizeLatest
            tickColor={palette.muted}
            formatTooltip={(index) => {
              const point = chartData[index];
              return {
                title: formatMonthYear(points[index]),
                meta: `${point.value.toLocaleString()} ${point.value === 1 ? "registration" : "registrations"}${point.partial ? " so far" : ""}`,
              };
            }}
          />
          {latestIsPartial && latest ? (
            <Text className="mt-2 text-[12px] font-medium" style={{ color: palette.muted }}>
              {`${expandMonth(latest.label)} is still in progress, so its point counts accounts so far.`}
            </Text>
          ) : null}
        </View>
      )}
    </PanelCard>
  );
};

export default RegistrationTrendPanel;
