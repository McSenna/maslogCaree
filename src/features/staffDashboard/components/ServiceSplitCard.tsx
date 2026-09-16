import { Text, View } from "react-native";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { serviceColor } from "@/design/serviceColors";
import { useTheme } from "@/contexts/ThemeContext";
import { calculatePercentage } from "@/features/adminDashboard/utils/dashboardAnalytics";
import type { ServiceBreakdownEntry } from "@/services/staffDashboardService";

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

  return (
    <PanelCard
      palette={palette}
      title="Service Distribution"
      icon="pie-chart"
      subtitle="Completed visits · last 30 days"
      fill={fill}
      centerContent
    >
      {total <= 0 ? (
        <EmptyPanelState
          palette={palette}
          icon="pie-chart"
          message="No completed visits in the last 30 days."
        />
      ) : (
        <View className="w-full gap-4">
          {breakdown.map((entry) => {
            const percent = calculatePercentage(entry.completed, total);
            const color = serviceColor(entry.key, isDark, palette.primary);

            return (
              <View
                key={entry.key}
                className="w-full gap-2"
                accessibilityRole="text"
                accessibilityLabel={`${entry.label}: ${entry.completed} completed, ${percent} percent`}
              >
                <View className="flex-row items-center gap-2.5">
                  <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <Text
                    className="min-w-0 flex-1 text-[13px] font-medium"
                    numberOfLines={1}
                    style={{ color: palette.body }}
                  >
                    {entry.label}
                  </Text>
                  <Text className="text-[13px] font-bold tabular-nums" style={{ color: palette.heading }}>
                    {percent}%
                  </Text>
                  <Text
                    className="w-8 text-right text-[12px] font-medium tabular-nums"
                    style={{ color: palette.subtle }}
                  >
                    {entry.completed}
                  </Text>
                </View>

                <View
                  className="h-2 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: palette.divider }}
                >
                  <View
                    style={{
                      width: `${Math.max(percent, entry.completed > 0 ? 2 : 0)}%`,
                      height: "100%",
                      borderRadius: 999,
                      backgroundColor: color,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}
    </PanelCard>
  );
};

export default ServiceSplitCard;
