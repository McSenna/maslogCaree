import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { formatSystemLogActionLabel, type SystemLog } from "@/services/systemLogService";
import LogDetailRows from "./LogDetailRows";
import StatusBadge from "./StatusBadge";
import { useSystemLogsPalette } from "./systemLogsTheme";

const DISMISS_THRESHOLD = 90;

type LogDetailsBottomSheetProps = {
  visible: boolean;
  log: SystemLog | null;
  onClose: () => void;
};

export default function LogDetailsBottomSheet({ visible, log, onClose }: LogDetailsBottomSheetProps) {
  const palette = useSystemLogsPalette();
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > DISMISS_THRESHOLD) {
          Animated.timing(translateY, { toValue: windowHeight, duration: 180, useNativeDriver: true }).start(() => {
            translateY.setValue(0);
            onClose();
          });
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }).start();
        }
      },
    })
  ).current;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close log details"
          onPress={onClose}
          className="absolute inset-0 bg-black/45"
        />

        <Animated.View
          style={{
            transform: [{ translateY }],
            maxHeight: "85%",
            backgroundColor: palette.cardBg,
            borderTopColor: palette.cardBorder,
          }}
          className="rounded-t-3xl border-t px-5 pb-6 pt-3"
        >
          <View {...panResponder.panHandlers} className="items-center pb-2 pt-1">
            <View className="h-1.5 w-10 rounded-full" style={{ backgroundColor: palette.cardBorder }} />
          </View>

          {log ? (
            <>
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 flex-row flex-wrap items-center gap-2">
                  <Text className="text-[16px] font-bold" style={{ color: palette.heading }}>
                    {formatSystemLogActionLabel(log)}
                  </Text>
                  <StatusBadge status={log.status} />
                </View>
                <Pressable
                  onPress={onClose}
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
                <Text className="mt-1.5 text-[13px] leading-relaxed" style={{ color: palette.muted }}>
                  {log.description}
                </Text>
              ) : null}

              <ScrollView
                showsVerticalScrollIndicator={false}
                className="mt-3 border-t"
                style={{ borderTopColor: palette.divider }}
              >
                <LogDetailRows log={log} />
              </ScrollView>
            </>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
}
