import { Text, View } from "react-native";
import type { SystemLogSeverity } from "@/services/systemLogService";
import { useSystemLogsPalette } from "./systemLogsTheme";

export default function SeverityIndicator({ severity }: { severity: SystemLogSeverity }) {
  const palette = useSystemLogsPalette();
  const tone = palette.severity[severity] ?? palette.severity.info;

  return (
    // The dot is decorative — the label carries the meaning so severity is
    // never conveyed by colour alone.
    <View
      accessibilityRole="text"
      accessibilityLabel={`Severity: ${tone.label}`}
      className="flex-row items-center gap-1.5"
    >
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: tone.dot }} />
      <Text className="text-[13px] font-medium" style={{ color: palette.body }}>
        {tone.label}
      </Text>
    </View>
  );
}
