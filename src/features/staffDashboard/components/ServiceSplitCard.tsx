import { Text, View } from "react-native";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { serviceColor } from "@/design/serviceColors";
import { useTheme } from "@/contexts/ThemeContext";
import { calculatePercentage } from "@/features/adminDashboard/utils/dashboardAnalytics";
import type { ServiceBreakdownEntry } from "@/services/staffDashboardService";

const visits = (n: number) => `${n.toLocaleString()} ${n === 1 ? "visit" : "visits"}`;

const ServiceSplitCard = ({
  palette,
  breakdown,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  breakdown: ServiceBreakdownEntry[];
  fill?: boolean;
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const total = breakdown.reduce((sum, entry) => sum + entry.completed, 0);
  const rows = breakdown.map((entry) => ({
    ...entry,
    percent: calculatePercentage(entry.completed, total),
    color: serviceColor(entry.key, isDark, palette.primary),
  }));

  return (
    <PanelCard
      palette={palette}
      title="Service Distribution"
      icon="pie-chart"
      subtitle="Completed visits · last 30 days"
      fill={fill}
    >
      {total <= 0 ? (
        <EmptyPanelState
          palette={palette}
          icon="pie-chart"
          message="No completed visits in the last 30 days."
        />
      ) : (
        <View className="w-full gap-5">
          <View>
            <Text
              className="text-[30px] font-bold"
              accessibilityLabel={`${visits(total)} completed in the last 30 days`}
              style={{ color: palette.heading, lineHeight: 36, fontVariant: ["tabular-nums"] }}
            >
              {total.toLocaleString()}
            </Text>
            <Text className="text-[12.5px] font-medium" style={{ color: palette.muted }}>
              completed across {rows.length} {rows.length === 1 ? "service" : "services"}
            </Text>
          </View>

          {/* One bar split by share, so the proportions are read against the same whole. */}
          <View
            className="h-3 w-full flex-row overflow-hidden rounded-full"
            style={{ backgroundColor: palette.divider, gap: 2 }}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {rows
              .filter((row) => row.completed > 0)
              .map((row) => (
                <View key={row.key} style={{ flexGrow: row.completed, backgroundColor: row.color }} />
              ))}
          </View>

          <View className="w-full">
            {rows.map((row, index) => (
              <View
                key={row.key}
                className="w-full flex-row items-center gap-3 py-2.5"
                style={{ borderTopWidth: index > 0 ? 1 : 0, borderColor: palette.divider }}
                accessible
                accessibilityLabel={`${row.label}: ${visits(row.completed)} completed, ${row.percent} percent. ${row.today} scheduled today.`}
              >
                <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                <View className="min-w-0 flex-1">
                  <Text
                    className="text-[13.5px] font-semibold"
                    numberOfLines={1}
                    style={{ color: palette.heading }}
                  >
                    {row.label}
                  </Text>
                  <Text className="text-[12px] font-medium" numberOfLines={1} style={{ color: palette.muted }}>
                    {row.today} scheduled today
                  </Text>
                </View>
                <Text
                  className="text-[13.5px] font-bold"
                  style={{ color: palette.heading, fontVariant: ["tabular-nums"] }}
                >
                  {row.completed.toLocaleString()}
                </Text>
                <Text
                  className="w-11 text-right text-[12.5px] font-semibold"
                  style={{ color: palette.subtle, fontVariant: ["tabular-nums"] }}
                >
                  {row.percent}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </PanelCard>
  );
};

export default ServiceSplitCard;
