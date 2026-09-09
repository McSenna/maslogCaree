import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import {
  formatSystemLogActionLabel,
  formatSystemLogDate,
  type SystemLog,
} from "@/services/systemLogService";
import SeverityIndicator from "./SeverityIndicator";
import StatusBadge from "./StatusBadge";
import { CARD_SHADOW, useSystemLogsPalette } from "./systemLogsTheme";

export default function MobileLogCard({
  log,
  isSelected,
  onPress,
}: {
  log: SystemLog;
  isSelected: boolean;
  onPress: () => void;
}) {
  const palette = useSystemLogsPalette();
  const severityTone = palette.severity[log.severity];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${formatSystemLogActionLabel(log)}, ${log.userName}, ${formatSystemLogDate(log.createdAt)}, status ${log.status}`}
      className="flex-row items-start gap-3 rounded-2xl border p-3.5"
      style={{
        backgroundColor: isSelected ? palette.rowSelected : palette.cardBg,
        borderColor: isSelected ? palette.bannerBorder : palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View className="h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: severityTone.bg }}>
        <Feather name="activity" size={16} color={severityTone.dot} />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="flex-1 text-[14px] font-semibold" style={{ color: palette.heading }} numberOfLines={1}>
            {formatSystemLogActionLabel(log)}
          </Text>
          <StatusBadge status={log.status} />
        </View>
        <Text className="mt-1 text-[12.5px]" style={{ color: palette.body }} numberOfLines={1}>
          {log.userName}
        </Text>
        <Text className="mt-0.5 text-[11.5px]" style={{ color: palette.muted }} numberOfLines={1}>
          {formatSystemLogDate(log.createdAt)}
        </Text>
        <View className="mt-1.5 flex-row items-center justify-between gap-2">
          <Text
            className="text-[11.5px]"
            style={{ color: palette.muted, fontFamily: "monospace" }}
            numberOfLines={1}
          >
            {log.ipAddress}
          </Text>
          <SeverityIndicator severity={log.severity} />
        </View>
      </View>

      <Feather name="chevron-right" size={16} color={palette.subtle} style={{ marginTop: 6 }} />
    </Pressable>
  );
}
