import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";

const ModalHeader = ({
  title,
  subtitle,
  badge,
  dismissible,
  onRequestClose,
  palette,
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  dismissible: boolean;
  onRequestClose: () => void;
  palette: QueuePalette;
}) => (
  <View
    className="flex-row items-start justify-between gap-3 px-5 py-4"
    style={{ backgroundColor: palette.panelBg, borderBottomWidth: 1, borderBottomColor: palette.divider }}
  >
    <View className="min-w-0 flex-1 gap-1">
      <Text
        accessibilityRole="header"
        className="text-[17px] font-bold"
        style={{ color: palette.heading }}
        numberOfLines={1}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-[12.5px] font-medium" style={{ color: palette.muted }} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
      {badge ? <View className="mt-0.5 flex-row">{badge}</View> : null}
    </View>

    <Pressable
      onPress={() => dismissible && onRequestClose()}
      disabled={!dismissible}
      accessibilityRole="button"
      accessibilityLabel="Close without completing"
      hitSlop={12}
      className="h-9 w-9 items-center justify-center rounded-full"
      style={{ backgroundColor: palette.skeleton, opacity: dismissible ? 1 : 0.5 }}
    >
      <Feather name="x" size={17} color={palette.muted} />
    </Pressable>
  </View>
);

export default ModalHeader;
