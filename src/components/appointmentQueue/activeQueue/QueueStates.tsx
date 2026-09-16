import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { QUEUE_RADIUS, type QueuePalette } from "../queueTheme";

export const QueueLoadingState = ({ palette }: { palette: QueuePalette }) => (
  <View className="gap-3 px-4 py-4">
    {[0, 1, 2].map((i) => (
      <View key={i} className="flex-row items-center gap-3">
        <View style={{ height: 44, width: 44, borderRadius: 12, backgroundColor: palette.skeleton }} />
        <View className="flex-1 gap-1.5">
          <View style={{ height: 13, width: "55%", borderRadius: 6, backgroundColor: palette.skeleton }} />
          <View style={{ height: 11, width: "35%", borderRadius: 6, backgroundColor: palette.skeleton }} />
        </View>
      </View>
    ))}
  </View>
);

export const QueueErrorState = ({
  palette,
  error,
  onRetry,
}: {
  palette: QueuePalette;
  error: string;
  onRetry: () => void;
}) => (
  <View className="items-center gap-2.5 px-4 py-8">
    <Feather name="alert-circle" size={20} color={palette.muted} />
    <Text className="text-center text-[13px]" style={{ color: palette.muted }}>
      {error}
    </Text>
    <Pressable
      onPress={onRetry}
      accessibilityRole="button"
      accessibilityLabel="Try loading the queue again"
      className="h-9 items-center justify-center px-4"
      style={{ borderRadius: QUEUE_RADIUS.control, borderWidth: 1, borderColor: palette.panelBorder }}
    >
      <Text className="text-[13px] font-semibold" style={{ color: palette.primary }}>
        Try again
      </Text>
    </Pressable>
  </View>
);

export const QueueEmptyState = ({
  palette,
  message,
}: {
  palette: QueuePalette;
  message: string;
}) => (
  <View className="items-center gap-2 px-4 py-9">
    <Feather name="check-circle" size={22} color={palette.tones.green.fg} />
    <Text className="text-center text-[13px]" style={{ color: palette.muted }}>
      {message}
    </Text>
  </View>
);
