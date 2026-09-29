import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { AdminDashboardPalette, StatusToneName } from "@/design/adminDashboardTheme";

/** A status word in its semantic colour. The text always carries the meaning; colour only reinforces it. */
const StatusPill = ({
  palette,
  tone,
  label,
  icon,
}: {
  palette: AdminDashboardPalette;
  tone: StatusToneName;
  label: string;
  icon?: keyof typeof Feather.glyphMap;
}) => {
  const colors = palette.statusTones[tone];
  return (
    <View
      className="flex-row items-center rounded-full px-2.5"
      style={{ height: 24, gap: 5, backgroundColor: colors.bg }}
    >
      {icon ? <Feather name={icon} size={12} color={colors.fg} /> : null}
      <Text className="text-[12px] font-semibold" numberOfLines={1} style={{ color: colors.fg }}>
        {label}
      </Text>
    </View>
  );
};

export default StatusPill;
