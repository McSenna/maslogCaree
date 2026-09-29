import PanelCard from "@/components/dashboard/admin/PanelCard";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import AnalyticsSummary from "@/components/dashboard/admin/analytics/AnalyticsSummary";
import SimpleBarChart from "@/components/ui/charts/SimpleBarChart";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

type MonthBar = { label: string; value: number };

/** The resident's appointments per month over the last six months, current month last. */
const VisitsChartCard = ({
  palette,
  months,
  compact,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  months: MonthBar[];
  compact: boolean;
  fill?: boolean;
}) => {
  const total = months.reduce((sum, month) => sum + month.value, 0);
  const plural = (n: number) => `${n} ${n === 1 ? "appointment" : "appointments"}`;

  return (
    <PanelCard palette={palette} title="My visits" icon="bar-chart-2" subtitle="Appointments per month, last 6 months" fill={fill}>
      <AnalyticsSummary palette={palette} value={total.toLocaleString()} accessibilityLabel={`${plural(total)} in the last 6 months`} />
      {total === 0 ? (
        <EmptyPanelState palette={palette} icon="bar-chart-2" message="Your visits will show here after your first appointment." />
      ) : (
        <SimpleBarChart
          data={months.map((month, index) => ({
            label: month.label,
            value: month.value,
            partial: index === months.length - 1,
          }))}
          height={compact ? 160 : 180}
          accentColor={palette.primary}
          dimColor={palette.bannerArt}
          highlightPeak={false}
          gridDashed
          tickColor={palette.muted}
          maxBarWidth={36}
          formatTooltip={(datum, index) => ({
            title: index === months.length - 1 ? `${datum.label} (so far)` : datum.label,
            meta: plural(datum.value),
          })}
        />
      )}
    </PanelCard>
  );
};

export default VisitsChartCard;
