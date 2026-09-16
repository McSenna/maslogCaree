import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { STAT_TONE, type IconName, type StatTone } from "./recordPresentation";


export type StatCardProps = {
  label: string;
  value: number;
  icon: IconName;
  tone?: StatTone;
};

const StatCard = ({ label, value, icon, tone = "blue" }: StatCardProps) => {
  const t = STAT_TONE[tone];
  return (
    <View
      className="flex-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4"
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      <View className={`h-9 w-9 items-center justify-center rounded-full ${t.bg}`}>
        <Feather name={icon} size={16} color={t.icon} />
      </View>
      <View className="gap-0.5">
        <Text className={`text-2xl font-bold ${t.value}`}>{value}</Text>
        <Text className="text-xs font-medium text-slate-500">{label}</Text>
      </View>
    </View>
  );
};

export default StatCard;
