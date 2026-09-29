import { View } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";
import { DASHBOARD_CARD_SHADOW, DASHBOARD_RADIUS, type AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { MetricRow, SplitRow } from "./DashboardLayout";

export type SkeletonRowSpec = { weights: number[]; height: number };

const card = (palette: AdminDashboardPalette) => ({
  backgroundColor: palette.cardBg,
  borderColor: palette.cardBorder,
  borderRadius: DASHBOARD_RADIUS.card,
  ...DASHBOARD_CARD_SHADOW,
});

const MetricPlaceholder = ({ palette, compact }: { palette: AdminDashboardPalette; compact: boolean }) => (
  <View className={`border ${compact ? "p-3.5" : "p-4"}`} style={card(palette)}>
    <View className="flex-row items-start justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton style={{ width: compact ? 32 : 36, height: compact ? 32 : 36, borderRadius: 10 }} />
    </View>
    <Skeleton className={compact ? "mt-1 h-6 w-12" : "mt-1.5 h-8 w-16"} />
    <Skeleton className="mt-2 h-2.5 w-28" />
  </View>
);

const PanelPlaceholder = ({ palette, height }: { palette: AdminDashboardPalette; height: number }) => (
  <View className="gap-3 border p-4" style={[card(palette), { height }]}>
    <View className="flex-row items-center gap-2.5">
      <Skeleton style={{ width: 36, height: 36, borderRadius: 12 }} />
      <View className="gap-1.5">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-2.5 w-24" />
      </View>
    </View>
    <Skeleton className="w-full flex-1" style={{ borderRadius: 12 }} />
  </View>
);

/**
 * Loading state in the shape of the finished dashboard (below the header, which renders straight away),
 * so nothing jumps when the data lands.
 */
const DashboardSkeleton = ({
  palette,
  compact,
  metricColumns,
  gap,
  rows,
}: {
  palette: AdminDashboardPalette;
  compact: boolean;
  metricColumns: 2 | 4;
  gap: number;
  rows: SkeletonRowSpec[];
}) => (
  <View style={{ gap }} accessibilityLabel="Loading dashboard" accessibilityRole="progressbar">
    <MetricRow columns={metricColumns} gap={gap}>
      {[0, 1, 2, 3].map((index) => (
        <MetricPlaceholder key={index} palette={palette} compact={compact} />
      ))}
    </MetricRow>

    {rows.map((row, rowIndex) => (
      <SplitRow key={rowIndex} weights={row.weights} stacked={compact} gap={gap}>
        {row.weights.map((_, index) => (
          <PanelPlaceholder key={index} palette={palette} height={compact ? Math.min(row.height, 280) : row.height} />
        ))}
      </SplitRow>
    ))}
  </View>
);

export default DashboardSkeleton;
