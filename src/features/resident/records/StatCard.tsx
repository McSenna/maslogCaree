import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { getAdminDashboardPalette, type MetricTone } from "@/design/adminDashboardTheme";
import type { IconName } from "./recordPresentation";

// Resident record screens are light-only, like the rest of the resident app.
const palette = getAdminDashboardPalette("light");

export type StatCardProps = {
  label: string;
  value: number;
  icon: IconName;
  tone?: MetricTone;
};

const StatCard = ({ label, value, icon, tone = "primary" }: StatCardProps) => {
  const toneStyle = palette.tones[tone];
  return (
    <View
      className="flex-1 gap-3 rounded-lg border border-slate-200 bg-white p-4"
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: toneStyle.iconBg }}
      >
        <Feather name={icon} size={16} color={toneStyle.icon} />
      </View>
      <View className="gap-0.5">
        <Text className="text-2xl font-bold text-slate-800">{value}</Text>
        <Text className="text-xs font-medium text-slate-600">{label}</Text>
      </View>
    </View>
  );
};

export default StatCard;
