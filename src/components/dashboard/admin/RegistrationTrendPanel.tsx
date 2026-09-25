import SimpleLineChart from "@/components/ui/charts/SimpleLineChart";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { expandMonth } from "@/features/adminDashboard/utils/dashboardAnalytics";
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

const registrations = (count: number) => `${count.toLocaleString()} ${count === 1 ? "registration" : "registrations"}`;

const monthOverMonth = (trend: TrendPoint[]): SummaryDelta | null => {
  if (trend.length < 2) return null;
  const delta = trend[trend.length - 1].count - trend[trend.length - 2].count;
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  return {
    direction,
    value: `${delta > 0 ? "+" : ""}${delta}`,
    comparison: "vs last month",
    accessibilityLabel:
      delta === 0
        ? "Same as last month"
        : `${Math.abs(delta)} ${delta > 0 ? "more" : "fewer"} than last month`,
  };
};

const RegistrationTrendPanel = ({
  palette,
  trend,
  compact = false,
  fill = false,
}: RegistrationTrendPanelProps) => {
  const total = trend.reduce((sum, point) => sum + point.count, 0);
  const latest = trend.length > 0 ? trend[trend.length - 1] : null;

  return (
    <PanelCard
      palette={palette}
      title="User Registrations"
      icon="user-plus"
      subtitle="New accounts · last 6 months"
      fill={fill}
    >
      <AnalyticsSummary
        palette={palette}
        value={total.toLocaleString()}
        accessibilityLabel={`${total} new accounts in the last 6 months`}
        delta={monthOverMonth(trend)}
        aside={
          latest ? (
            <HighlightStat
              palette={palette}
              tone="blue"
              icon="calendar-month-outline"
              label="Latest month"
              value={expandMonth(latest.label)}
              meta={`${latest.count.toLocaleString()} new ${latest.count === 1 ? "account" : "accounts"}`}
            />
          ) : null
        }
      />

      {total === 0 ? (
        <EmptyPanelState
          palette={palette}
          icon="user-plus"
          message="No registrations in the last 6 months."
        />
      ) : (
        <SimpleLineChart
          labels={trend.map((point) => point.label)}
          series={[
            { values: trend.map((point) => point.count), color: palette.primary, showArea: true },
          ]}
          height={compact ? 176 : 196}
          showLegend={false}
          gridDashed
          tickColor={palette.muted}
          emphasizeLatest
          formatTooltip={(index) => {
            const point = trend[index];
            return { title: expandMonth(point.label), meta: registrations(point.count) };
          }}
        />
      )}
    </PanelCard>
  );
};

export default RegistrationTrendPanel;
