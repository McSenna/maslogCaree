import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { QUEUE_RADIUS, useQueuePalette } from "./queueTheme";

/**
 * The bordered white panel the dashboard's sections share.
 *
 * Extracted only because the header — tinted icon, title, optional trailing
 * slot, hairline under all of it — has to be identical across the three; the
 * bodies have nothing in common and stay with their own components.
 */
export default function QueuePanel({
  icon,
  title,
  trailing,
  children,
  bodyPadding = true,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  /** Right-hand side of the header — an action, a date, a link. */
  trailing?: ReactNode;
  children: ReactNode;
  /** Off for a table that should meet the panel's own edges. */
  bodyPadding?: boolean;
}) {
  const palette = useQueuePalette();

  return (
    <View
      className="w-full overflow-hidden border"
      style={{
        borderRadius: QUEUE_RADIUS.panel,
        backgroundColor: palette.panelBg,
        borderColor: palette.panelBorder,
      }}
    >
      <View
        className="flex-row items-center justify-between gap-3 px-5 py-4"
        style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
      >
        <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
          <Feather name={icon} size={19} color={palette.primary} />
          <Text
            accessibilityRole="header"
            numberOfLines={1}
            className="min-w-0 flex-1 text-[17px] font-bold"
            style={{ color: palette.heading }}
          >
            {title}
          </Text>
        </View>
        {trailing}
      </View>

      <View className={bodyPadding ? "px-5 py-3" : ""}>{children}</View>
    </View>
  );
}
