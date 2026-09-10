import { Text, View } from "react-native";
import { RADIUS, useInventoryPalette, type DisplayStatus } from "./inventoryTheme";

type StockStatusBadgeProps = {
  status: DisplayStatus;
  compact?: boolean;
};

/**
 * Stock / expiry status pill.
 *
 * The dot is decorative and the label carries the meaning, so status is never
 * communicated by colour alone.
 */
export default function StockStatusBadge({ status, compact = false }: StockStatusBadgeProps) {
  const palette = useInventoryPalette();
  const tone = palette.statuses[status] ?? palette.statuses["in-stock"];

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Status: ${tone.label}`}
      className={`flex-row items-center self-start gap-1.5 ${compact ? "px-2 py-1" : "px-2.5 py-1.5"}`}
      style={{ backgroundColor: tone.bg, borderRadius: RADIUS.pill }}
    >
      <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone.dot }} />
      <Text
        numberOfLines={1}
        className={compact ? "text-[11px] font-semibold" : "text-[12px] font-semibold"}
        style={{ color: tone.text }}
      >
        {tone.label}
      </Text>
    </View>
  );
}
