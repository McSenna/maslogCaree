import { View } from "react-native";

import { Skeleton } from "@/components/ui/Skeleton";
import { DASHBOARD_CARD_SHADOW, DASHBOARD_RADIUS, type AdminDashboardPalette } from "@/design/adminDashboardTheme";

/** A MetricCard-shaped placeholder, so nothing jumps when the numbers land. */
const MetricCardSkeleton = ({ palette, compact }: { palette: AdminDashboardPalette; compact: boolean }) => (
  <View
    className={`border ${compact ? "p-3.5" : "p-4"}`}
    style={{
      backgroundColor: palette.cardBg,
      borderColor: palette.cardBorder,
      borderRadius: DASHBOARD_RADIUS.card,
      ...DASHBOARD_CARD_SHADOW,
    }}
  >
    <View className="flex-row items-start justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton style={{ width: compact ? 32 : 36, height: compact ? 32 : 36, borderRadius: 10 }} />
    </View>
    <Skeleton className={compact ? "mt-1 h-6 w-12" : "mt-1.5 h-8 w-16"} />
    <Skeleton className="mt-2 h-2.5 w-28" />
  </View>
);

export default MetricCardSkeleton;
