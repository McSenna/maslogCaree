import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { QUEUE_RADIUS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";

export const SectionCard = ({
  icon,
  title,
  caption,
  children,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  caption?: string;
  children: ReactNode;
}) => {
  const palette = useQueuePalette();

  return (
    <View
      className="w-full gap-3.5 p-4"
      style={{
        borderRadius: QUEUE_RADIUS.card,
        borderWidth: 1,
        borderColor: palette.panelBorder,
        backgroundColor: palette.panelBg,
      }}
    >
      <View className="flex-row items-center gap-2.5">
        <View
          className="h-8 w-8 items-center justify-center"
          style={{ borderRadius: 10, backgroundColor: palette.primarySoft }}
        >
          <Feather name={icon} size={15} color={palette.primary} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-[14px] font-bold" style={{ color: palette.heading }} numberOfLines={1}>
            {title}
          </Text>
          {caption ? (
            <Text className="text-[11.5px]" style={{ color: palette.muted }} numberOfLines={1}>
              {caption}
            </Text>
          ) : null}
        </View>
      </View>
      {children}
    </View>
  );
};
