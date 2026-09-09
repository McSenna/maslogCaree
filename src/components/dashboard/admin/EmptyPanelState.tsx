import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

type EmptyPanelStateProps = {
  palette: AdminDashboardPalette;
  icon: keyof typeof Feather.glyphMap;
  message: string;
};

/** Keeps a panel readable when its query came back empty. */
export default function EmptyPanelState({ palette, icon, message }: EmptyPanelStateProps) {
  return (
    <View className="items-center gap-2 py-8">
      <View
        className="h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.divider }}
      >
        <Feather name={icon} size={20} color={palette.subtle} />
      </View>
      <Text className="text-center text-[13px] font-medium" style={{ color: palette.muted }}>
        {message}
      </Text>
    </View>
  );
}
