import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { DASHBOARD_RADIUS, type AdminDashboardPalette } from "@/design/adminDashboardTheme";

export type DeltaDirection = "up" | "down" | "flat";

const ICONS: Record<DeltaDirection, keyof typeof Feather.glyphMap> = {
  up: "trending-up",
  down: "trending-down",
  flat: "minus",
};

/** Change indicator: green when up, red when down, grey when unchanged. */
const DeltaChip = ({
  palette,
  direction,
  value,
  accessibilityLabel,
}: {
  palette: AdminDashboardPalette;
  direction: DeltaDirection;
  value: string;
  accessibilityLabel: string;
}) => {
  const tone =
    direction === "flat" ? { text: palette.muted, bg: palette.divider } : palette.trends[direction];

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      className="flex-row items-center gap-1 px-2 py-0.5"
      style={{ backgroundColor: tone.bg, borderRadius: DASHBOARD_RADIUS.pill }}
    >
      <Feather name={ICONS[direction]} size={12} color={tone.text} />
      <Text className="text-[12px] font-bold" style={{ color: tone.text, fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
    </View>
  );
};

export default DeltaChip;
