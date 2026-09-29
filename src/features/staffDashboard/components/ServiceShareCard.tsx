import { Text, View } from "react-native";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { serviceColor } from "@/design/serviceColors";
import { ALL_SERVICES, PERIOD_DAYS, type ServiceShare, type StaffPeriod } from "../model/staffDashboardModel";

const visits = (n: number) => `${n.toLocaleString()} ${n === 1 ? "visit" : "visits"}`;

/**
 * Completed visits split by service for the selected period. One bar split by share, so proportions are
 * read against the same whole; the filtered service stays at full strength and the rest recede.
 */
const ServiceShareCard = ({
  palette,
  isDark,
  shares,
  period,
  service,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  isDark: boolean;
  shares: ServiceShare[];
  period: StaffPeriod;
  service: string;
  fill?: boolean;
}) => {
  const total = shares.reduce((sum, share) => sum + share.count, 0);
  const days = PERIOD_DAYS[period];
  const dimmed = (key: string) => service !== ALL_SERVICES && service !== key;

  return (
    <PanelCard
      palette={palette}
      title="Visits by service"
      icon="pie-chart"
      subtitle={`Completed, last ${days} days`}
      fill={fill}
    >
      {total <= 0 ? (
        <EmptyPanelState palette={palette} icon="pie-chart" message={`No completed visits in the last ${days} days.`} />
      ) : (
        <View className="w-full gap-4">
          <View>
            <Text
              className="text-[30px] font-bold"
              accessibilityLabel={`${visits(total)} completed in the last ${days} days`}
              style={{ color: palette.heading, lineHeight: 36, letterSpacing: -0.5, fontVariant: ["tabular-nums"] }}
            >
              {total.toLocaleString()}
            </Text>
            <Text className="text-[12.5px] font-medium" style={{ color: palette.muted }}>
              completed across {shares.length} {shares.length === 1 ? "service" : "services"}
            </Text>
          </View>

          <View
            className="h-3 w-full flex-row overflow-hidden rounded-full"
            style={{ backgroundColor: palette.divider, gap: 2 }}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {shares
              .filter((share) => share.count > 0)
              .map((share) => (
                <View
                  key={share.key}
                  style={{
                    flexGrow: share.count,
                    backgroundColor: serviceColor(share.key, isDark, palette.primary),
                    opacity: dimmed(share.key) ? 0.25 : 1,
                  }}
                />
              ))}
          </View>

          <View className="w-full">
            {shares.map((share, index) => (
              <View
                key={share.key}
                className="w-full flex-row items-center gap-3 py-2.5"
                style={{
                  borderTopWidth: index > 0 ? 1 : 0,
                  borderColor: palette.divider,
                  opacity: dimmed(share.key) ? 0.55 : 1,
                }}
                accessible
                accessibilityLabel={`${share.label}: ${visits(share.count)}, ${share.percent} percent`}
              >
                <View
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: serviceColor(share.key, isDark, palette.primary) }}
                />
                <Text
                  className="min-w-0 flex-1 text-[13.5px] font-semibold"
                  numberOfLines={1}
                  style={{ color: palette.heading }}
                >
                  {share.label}
                </Text>
                <Text className="text-[13.5px] font-bold" style={{ color: palette.heading, fontVariant: ["tabular-nums"] }}>
                  {share.count.toLocaleString()}
                </Text>
                <Text
                  className="w-11 text-right text-[12.5px] font-semibold"
                  style={{ color: palette.muted, fontVariant: ["tabular-nums"] }}
                >
                  {share.percent}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </PanelCard>
  );
};

export default ServiceShareCard;
