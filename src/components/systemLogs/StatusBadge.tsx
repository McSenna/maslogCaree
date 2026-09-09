import { Text, View } from "react-native";
import type { SystemLogStatus } from "@/services/systemLogService";
import { useSystemLogsPalette } from "./systemLogsTheme";

export default function StatusBadge({ status }: { status: SystemLogStatus }) {
  const palette = useSystemLogsPalette();
  const tone = palette.status[status] ?? palette.status.Success;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Status: ${tone.label}`}
      className="self-start rounded-full px-2 py-1"
      style={{ backgroundColor: tone.bg }}
    >
      <Text className="text-xs font-semibold" style={{ color: tone.text }}>
        {tone.label}
      </Text>
    </View>
  );
}
