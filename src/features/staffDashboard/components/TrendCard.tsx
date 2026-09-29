import { useMemo } from "react";
import { View } from "react-native";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import AnalyticsSummary from "@/components/dashboard/admin/analytics/AnalyticsSummary";
import { SegmentedControl } from "@/components/dashboard/kit";
import SimpleBarChart from "@/components/ui/charts/SimpleBarChart";
import SimpleLineChart from "@/components/ui/charts/SimpleLineChart";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { serviceColor } from "@/design/serviceColors";
import type { DashboardService, StaffTrendPoint } from "@/services/staffDashboardService";
import type { RoleDashboardConfig } from "../config/roleDashboardConfig";
import {
  ALL_SERVICES,
  PERIOD_DAYS,
  summarizePeriod,
  type StaffPeriod,
} from "../model/staffDashboardModel";

const shortDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

/** Weekday names for a week; for a month, a date every few days so the axis never crowds. */
const axisLabels = (points: { label: string; date: string }[], period: StaffPeriod): string[] => {
  if (period === "7d") return points.map((point) => point.label);
  const stride = Math.max(1, Math.ceil(points.length / 6));
  return points.map((point, index) => (index % stride === 0 ? shortDate(point.date) : ""));
};

const COMPARISON: Record<StaffPeriod, string> = {
  "7d": "vs the 7 days before",
  "30d": "vs the 30 days before",
};

const TrendCard = ({
  palette,
  isDark,
  config,
  services,
  trend,
  period,
  onPeriodChange,
  service,
  compact = false,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  isDark: boolean;
  config: RoleDashboardConfig;
  services: DashboardService[];
  trend: StaffTrendPoint[];
  period: StaffPeriod;
  onPeriodChange: (period: StaffPeriod) => void;
  /** A service key, or ALL_SERVICES. */
  service: string;
  compact?: boolean;
  fill?: boolean;
}) => {
  const summary = useMemo(() => summarizePeriod(trend, period, service), [trend, period, service]);
  const labels = useMemo(() => axisLabels(summary.points, period), [summary.points, period]);
  const days = PERIOD_DAYS[period];

  const selected = services.find((entry) => entry.key === service);
  // One series reads best as bars; several services need lines so they can overlap.
  const single = service !== ALL_SERVICES || services.length <= 1 || config.chart.kind === "bars";
  const barColor = selected ? serviceColor(selected.key, isDark, palette.primary) : palette.primary;

  const change = summary.changePercent;
  const direction = change === null || change === 0 ? "flat" : change > 0 ? "up" : "down";
  const noun = `${summary.total === 1 ? "visit" : "visits"}`;
  const subject = selected ? `${selected.label} ${noun}` : `completed ${noun}`;

  const periodControl = (
    <SegmentedControl
      palette={palette}
      label="Chart period"
      value={period}
      onChange={onPeriodChange}
      fill={compact}
      options={[
        { value: "7d", label: "7 days" },
        { value: "30d", label: "30 days" },
      ]}
    />
  );

  return (
    <PanelCard
      palette={palette}
      title={config.chart.title}
      icon={config.chart.icon}
      subtitle={selected ? `${selected.label}, per day` : config.chart.subtitle}
      headerRight={compact ? undefined : periodControl}
      fill={fill}
    >
      {compact ? <View className="mb-3">{periodControl}</View> : null}
      <AnalyticsSummary
        palette={palette}
        value={summary.total.toLocaleString()}
        accessibilityLabel={`${summary.total} ${subject} in the last ${days} days`}
        delta={
          change === null
            ? undefined
            : {
                direction,
                value: `${change > 0 ? "+" : change < 0 ? "-" : ""}${Math.abs(change)}%`,
                comparison: COMPARISON[period],
                accessibilityLabel:
                  direction === "flat"
                    ? `No change ${COMPARISON[period]}`
                    : `${direction === "up" ? "Up" : "Down"} ${Math.abs(change)} percent ${COMPARISON[period]}`,
              }
        }
      />

      {summary.total === 0 ? (
        <EmptyPanelState
          palette={palette}
          icon={config.chart.icon}
          message={`No ${selected ? selected.label.toLowerCase() : "completed"} visits in the last ${days} days.`}
        />
      ) : single ? (
        <SimpleBarChart
          data={summary.points.map((point, index) => ({ label: labels[index], value: point.value }))}
          height={compact ? 170 : 196}
          accentColor={barColor}
          dimColor={palette.bannerArt}
          highlightPeak={period === "7d"}
          showLabels
          gridDashed
          tickColor={palette.muted}
          maxBarWidth={period === "7d" ? 40 : 14}
          formatTooltip={(datum, index) => ({
            title: shortDate(summary.points[index]?.date ?? ""),
            meta: `${datum.value} completed`,
          })}
        />
      ) : (
        <SimpleLineChart
          labels={labels}
          series={services.map((entry) => ({
            values: trend.slice(-days).map((point) => point.byService[entry.key] ?? 0),
            color: serviceColor(entry.key, isDark, palette.primary),
            label: entry.label,
            showArea: false,
          }))}
          height={compact ? 180 : 196}
          showLegend
          gridDashed
          tickColor={palette.muted}
          formatTooltip={(index) => {
            const point = trend.slice(-days)[index];
            return {
              title: shortDate(point?.date ?? ""),
              meta: services.map((entry) => `${entry.label}: ${point?.byService[entry.key] ?? 0}`).join(", "),
            };
          }}
        />
      )}
    </PanelCard>
  );
};

export default TrendCard;
