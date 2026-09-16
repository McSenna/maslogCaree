import { Pressable, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { QUEUE_RADIUS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";

type QueueRefreshButtonProps = {
  onPress: () => void;
  busy: boolean;
  accessibilityLabel: string;
};

const QueueRefreshButton = ({
  onPress,
  busy,
  accessibilityLabel,
}: QueueRefreshButtonProps) => {
  const palette = useQueuePalette();

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="h-10 flex-row items-center gap-2 px-3.5"
      style={{
        borderRadius: QUEUE_RADIUS.control,
        borderWidth: 1,
        borderColor: palette.panelBorder,
        opacity: busy ? 0.55 : 1,
      }}
    >
      <Feather name="refresh-cw" size={15} color={palette.primary} />
      <Text className="text-[13.5px] font-semibold" style={{ color: palette.primary }}>
        Refresh
      </Text>
    </Pressable>
  );
};

export default QueueRefreshButton;
