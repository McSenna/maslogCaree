import type { ReactNode } from "react";
import { Text, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import DeltaChip, { type DeltaDirection } from "./DeltaChip";

export type SummaryDelta = {
  direction: DeltaDirection;
  value: string;
  comparison: string;
  accessibilityLabel: string;
};

/**
 * The headline row shared by the analytics cards: the primary number with its change indicator on the
 * left and an optional highlight tile on the right, which wraps underneath when the card is narrow.
 */
const AnalyticsSummary = ({
  palette,
  value,
  accessibilityLabel,
  delta,
  aside,
}: {
  palette: AdminDashboardPalette;
  value: string;
  accessibilityLabel: string;
  delta?: SummaryDelta | null;
  aside?: ReactNode;
}) => (
  <View
    className="mb-3 flex-row flex-wrap items-center justify-between"
    style={{ columnGap: 16, rowGap: 12 }}
  >
    <View className="min-w-0 gap-1.5">
      <Text
        accessibilityLabel={accessibilityLabel}
        className="text-[30px] font-bold"
        style={{ color: palette.heading, lineHeight: 36, fontVariant: ["tabular-nums"] }}
      >
        {value}
      </Text>
      {delta ? (
        <View className="flex-row flex-wrap items-center gap-2">
          <DeltaChip
            palette={palette}
            direction={delta.direction}
            value={delta.value}
            accessibilityLabel={delta.accessibilityLabel}
          />
          <Text className="text-[12.5px] font-medium" style={{ color: palette.muted }}>
            {delta.comparison}
          </Text>
        </View>
      ) : null}
    </View>
    {aside}
  </View>
);

export default AnalyticsSummary;
