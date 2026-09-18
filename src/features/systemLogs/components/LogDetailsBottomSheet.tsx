import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import {
  formatSystemLogActionLabel,
  type SystemLog,
} from "@/features/systemLogs/services/systemLogService";

import LogDetailRows from "./LogDetailRows";
import StatusBadge from "./StatusBadge";
import { useSystemLogsPalette } from "./systemLogsTheme";

type LogDetailsBottomSheetProps = {
  visible: boolean;
  log: SystemLog | null;
  onClose: () => void;
};

const LogDetailsBottomSheet = ({ visible, log, onClose }: LogDetailsBottomSheetProps) => {
  const palette = useSystemLogsPalette();

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      accessibilityLabel="Log details"
      surface={palette.cardBg}
      handleColor={palette.cardBorder}
      scrim="rgba(0,0,0,0.45)"
      maxHeightRatio={0.85}
      header={(requestClose) =>
        log ? (
          <View className="px-5 pb-3 pt-1">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 flex-row flex-wrap items-center gap-2">
                <Text
                  accessibilityRole="header"
                  className="text-[16px] font-bold"
                  style={{ color: palette.heading }}
                >
                  {formatSystemLogActionLabel(log)}
                </Text>
                <StatusBadge status={log.status} />
              </View>
              <Pressable
                onPress={requestClose}
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={8}
                className="h-7 w-7 items-center justify-center rounded-full"
                style={{ backgroundColor: palette.iconWell }}
              >
                <Feather name="x" size={14} color={palette.muted} />
              </Pressable>
            </View>

            {log.description ? (
              <Text
                className="mt-1.5 text-[13px] leading-relaxed"
                style={{ color: palette.muted }}
              >
                {log.description}
              </Text>
            ) : null}
          </View>
        ) : null
      }
    >
      {log ? (
        <ScrollView
          style={SHEET_SCROLL_STYLE}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
        >
          <View style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
            <LogDetailRows log={log} />
          </View>
        </ScrollView>
      ) : null}
    </BottomSheet>
  );
};

export default LogDetailsBottomSheet;
