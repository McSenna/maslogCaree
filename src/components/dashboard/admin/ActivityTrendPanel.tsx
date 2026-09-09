import { Text, View } from "react-native";
import SimpleBarChart from "@/components/ui/charts/SimpleBarChart";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { TrendPoint } from "@/services/adminDashboardService";
import PanelCard from "./PanelCard";

type ActivityTrendPanelProps = {
  palette: AdminDashboardPalette;
  trend: TrendPoint[];
  compact?: boolean;
  fill?: boolean;
};

/** Logged system events per day for the last week. */
export default function ActivityTrendPanel({
  palette,
  trend,
  compact = false,
  fill = false,
}: ActivityTrendPanelProps) {
  const total = trend.reduce((sum, point) => sum + point.count, 0);
  const busiest = trend.reduce<TrendPoint | null>(
    (best, point) => (best === null || point.count > best.count ? point : best),
    null
  );

  return (
    <PanelCard palette={palette} title="System Activity" fill={fill}>
      {/* Same header rhythm as the registrations card so the two panels in
          the analytics row share a baseline. */}
      <View className="mb-4">
        <Text className="text-[28px] font-bold" style={{ color: palette.heading, lineHeight: 34 }}>
          {total.toLocaleString()}
        </Text>
        <Text className="mt-0.5 text-[12.5px] font-medium" style={{ color: palette.muted }}>
          {busiest && busiest.count > 0
            ? `Events this week · busiest ${busiest.label}`
            : "Events this week"}
        </Text>
      </View>

      {total === 0 ? (
        <View className="items-center justify-center py-10">
          <Text className="text-[13px] font-medium" style={{ color: palette.muted }}>
            No activity recorded this week.
          </Text>
        </View>
      ) : (
        <SimpleBarChart
          data={trend.map((point) => ({ label: point.label, value: point.count }))}
          height={compact ? 180 : 210}
          accentColor={palette.primary}
          dimColor={palette.bannerArt}
        />
      )}
    </PanelCard>
  );
}
