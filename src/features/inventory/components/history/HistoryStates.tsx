import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { RADIUS, useInventoryPalette } from "../inventoryTheme";

export const HistoryLoading = () => {
  const palette = useInventoryPalette();
  return (
    <View className="items-center gap-3 py-14">
      <ActivityIndicator size="small" color={palette.primary} />
      <Text className="text-[13px]" style={{ color: palette.muted }}>
        Loading history…
      </Text>
    </View>
  );
};

export const HistoryError = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  const palette = useInventoryPalette();
  return (
    <View className="items-center gap-3 py-14">
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: "#FEE2E2" }}
      >
        <Feather name="alert-circle" size={20} color={palette.danger} />
      </View>
      <Text className="text-center text-[13px]" style={{ color: palette.muted }}>
        {message}
      </Text>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry loading history"
        className="h-10 justify-center px-5"
        style={{ borderRadius: RADIUS.control, backgroundColor: palette.primary }}
      >
        <Text className="text-[13px] font-semibold text-white">Retry</Text>
      </Pressable>
    </View>
  );
};

export const HistoryEmpty = () => {
  const palette = useInventoryPalette();
  return (
    <View className="items-center gap-3 py-14">
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.divider }}
      >
        <Feather name="clock" size={20} color={palette.subtle} />
      </View>
      <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
        No stock movements yet
      </Text>
      <Text className="text-center text-[12.5px]" style={{ color: palette.muted }}>
        Adding or releasing stock records an entry here.
      </Text>
    </View>
  );
};

export const HistoryLoadMore = ({
  loadingMore,
  onPress,
}: {
  loadingMore: boolean;
  onPress: () => void;
}) => {
  const palette = useInventoryPalette();
  return (
    <Pressable
      onPress={onPress}
      disabled={loadingMore}
      accessibilityRole="button"
      accessibilityLabel="Load more history"
      className="my-4 h-11 flex-row items-center justify-center gap-2 border active:opacity-85"
      style={{
        borderRadius: RADIUS.control,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        opacity: loadingMore ? 0.6 : 1,
      }}
    >
      {loadingMore ? <ActivityIndicator size="small" color={palette.primary} /> : null}
      <Text className="text-[13.5px] font-semibold" style={{ color: palette.body }}>
        {loadingMore ? "Loading…" : "Load more"}
      </Text>
    </Pressable>
  );
};
