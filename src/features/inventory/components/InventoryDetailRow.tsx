import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useInventoryPalette } from "./inventoryTheme";

type InventoryDetailRowProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  /** Expiry dates that have passed, or are close, are called out in red. */
  emphasis?: boolean;
};

/**
 * One `icon + label ......... value` line.
 *
 * Shared by the desktop panel and the mobile sheet so the two cannot drift in
 * row height, icon size or alignment. The label is muted and left-aligned; the
 * value is the stronger of the two and sits hard right, which is what makes a
 * column of them scannable without a divider between each.
 */
export default function InventoryDetailRow({
  icon,
  label,
  value,
  emphasis = false,
}: InventoryDetailRowProps) {
  const palette = useInventoryPalette();

  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      className="flex-row items-center gap-2.5 py-1.5"
    >
      <View
        className="h-[26px] w-[26px] shrink-0 items-center justify-center"
        style={{ borderRadius: 8, backgroundColor: palette.divider }}
      >
        <Feather name={icon} size={12} color={palette.muted} />
      </View>
      <Text className="flex-1 text-[13px] font-medium" numberOfLines={1} style={{ color: palette.muted }}>
        {label}
      </Text>
      <Text
        className="shrink-0 text-[13px] font-semibold"
        numberOfLines={1}
        style={{ color: emphasis ? palette.danger : palette.heading }}
      >
        {value}
      </Text>
    </View>
  );
}
