import { Text, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

type StatusDotProps = {
  active: boolean;
  palette: AdminDashboardPalette;
};

const StatusDot = ({ active, palette }: StatusDotProps) => {
  const color = active ? palette.statusActive : palette.statusInactive;

  return (
    <View className="flex-row items-center gap-1.5">
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <Text className="text-[12px] font-medium" style={{ color: palette.muted }}>
        {active ? "Active" : "Inactive"}
      </Text>
    </View>
  );
};

export default StatusDot;
