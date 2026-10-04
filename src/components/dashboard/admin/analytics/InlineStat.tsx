import { Text, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

type Props = {
  palette: AdminDashboardPalette;
  label: string;
  value: string;
  meta: string;
};

/**
 * A secondary fact beside a panel's headline number: plain text, right-aligned
 * on wide cards. It replaced a tinted, iconed tile; the headline number is the
 * one thing in the panel that should stand out.
 */
const InlineStat = ({ palette, label, value, meta }: Props) => (
  <View accessible accessibilityLabel={`${label}: ${value}, ${meta}`} className="min-w-0 items-start gap-0.5">
    <Text className="text-[12px] font-medium" style={{ color: palette.muted }}>
      {label}
    </Text>
    <Text className="text-[15px] font-semibold" numberOfLines={1} style={{ color: palette.heading }}>
      {value}
    </Text>
    <Text className="text-[12px]" numberOfLines={1} style={{ color: palette.muted }}>
      {meta}
    </Text>
  </View>
);

export default InlineStat;
