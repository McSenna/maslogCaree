import { useMemo, useState } from "react";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import AnalyticsSummary from "@/components/dashboard/admin/analytics/AnalyticsSummary";
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

  // A change that rounds to 0% reads as "no change", not as a green or red signal.
  const direction = window.trend.percent === 0 ? "flat" : window.trend.direction;
  const sign = direction === "up" ? "+" : direction === "down" ? "-" : "";
  const visits = `${window.currentTotal.toLocaleString()} completed ${window.currentTotal === 1 ? "visit" : "visits"}`;

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
      <AnalyticsSummary
        palette={palette}
        value={window.currentTotal.toLocaleString()}
        accessibilityLabel={`${visits} in the last ${size} days`}
        delta={{
          direction,
          value: `${sign}${window.trend.percent}%`,
          comparison: RANGE_COMPARISON[range],
          accessibilityLabel:
            direction === "flat"
              ? `No change ${RANGE_COMPARISON[range]}`
              : `${direction === "up" ? "Up" : "Down"} ${window.trend.percent} percent ${RANGE_COMPARISON[range]}`,
        }}
      />

      {!hasAny ? (
        <EmptyPanelState
          palette={palette}
          icon={config.chart.icon}
          message="No completed visits in this period yet."
        />
      ) : config.chart.kind === "bars" ? (
        <SimpleBarChart
          data={points.map((point, index) => ({ label: labels[index], value: point.count }))}
          height={compact ? 170 : 180}
          accentColor={palette.primary}
          dimColor={palette.bannerArt}
          gridDashed
          tickColor={palette.muted}
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
          height={compact ? 180 : 184}
          showLegend={services.length > 1}
          gridDashed
          tickColor={palette.muted}
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
