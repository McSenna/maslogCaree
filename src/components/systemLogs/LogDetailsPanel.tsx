import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { formatSystemLogActionLabel, type SystemLog } from "@/services/systemLogService";
import LogDetailRows from "./LogDetailRows";
import StatusBadge from "./StatusBadge";
import { CARD_SHADOW, useSystemLogsPalette } from "./systemLogsTheme";

type LogDetailsPanelProps = {
  log: SystemLog | null;
  onClose: () => void;
};

export default function LogDetailsPanel({ log, onClose }: LogDetailsPanelProps) {
  const palette = useSystemLogsPalette();
  const severityTone = log ? palette.severity[log.severity] : palette.severity.info;

  return (
    <View
      className="h-full rounded-2xl border p-5"
      style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder, ...CARD_SHADOW }}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold" style={{ color: palette.heading }}>
          Log Details
        </Text>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close log details"
          hitSlop={8}
          className="h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: palette.iconWell }}
        >
          <Feather name="x" size={14} color={palette.muted} />
        </Pressable>
      </View>

      {!log ? (
        <View className="mt-10 items-center gap-2 px-2">
          <Feather name="file-text" size={22} color={palette.subtle} />
          <Text className="text-center text-sm" style={{ color: palette.muted }}>
            Select a log entry to view its details.
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
          <View className="flex-row items-start gap-3">
            <View
              className="mt-0.5 h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: severityTone.bg }}
            >
              <Feather name="file-text" size={16} color={severityTone.dot} />
            </View>
            <View className="flex-1">
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="text-[15px] font-bold" style={{ color: palette.heading }}>
                  {formatSystemLogActionLabel(log)}
                </Text>
                <StatusBadge status={log.status} />
              </View>
              {log.description ? (
                <Text className="mt-1 text-[13px] leading-relaxed" style={{ color: palette.muted }}>
                  {log.description}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="mt-4 border-t" style={{ borderTopColor: palette.divider }}>
            <LogDetailRows log={log} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
