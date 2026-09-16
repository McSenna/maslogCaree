import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

type BusiestDayCardProps = {
  palette: AdminDashboardPalette;
  day: string | null;
  compact?: boolean;
};

const AMBER = {
  light: { bg: "#FFF8EC", border: "#FBE8C6", chip: "#FDECC8", icon: "#D97706", label: "#92640C" },
  dark: { bg: "rgba(217,119,6,0.14)", border: "rgba(217,119,6,0.32)", chip: "rgba(217,119,6,0.24)", icon: "#F59E0B", label: "#FBBF24" },
};

const BusiestDayCard = ({ palette, day, compact = false }: BusiestDayCardProps) => {
  const { resolvedTheme } = useTheme();
  const tone = resolvedTheme === "dark" ? AMBER.dark : AMBER.light;

  return (
    <View
      accessible
      accessibilityLabel={day ? `Busiest day: ${day}` : "Busiest day: not yet available"}
      className={`flex-row items-center self-start gap-2.5 rounded-xl border ${compact ? "px-3 py-2" : "px-3.5 py-2.5"}`}
      style={{ backgroundColor: tone.bg, borderColor: tone.border }}
    >
      <View
        className="h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: tone.chip }}
      >
        <MaterialCommunityIcons name="fire" size={16} color={tone.icon} />
      </View>
      <View className="min-w-0">
        <Text className="text-[11px] font-medium" style={{ color: tone.label }}>
          Busiest Day
        </Text>
        <Text
          numberOfLines={1}
          className={compact ? "text-[13px] font-bold" : "text-[14px] font-bold"}
          style={{ color: palette.heading }}
        >
          {day ?? "—"}
        </Text>
      </View>
    </View>
  );
};

export default BusiestDayCard;
