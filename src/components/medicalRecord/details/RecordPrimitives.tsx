import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import { formatDateTime } from "@/utils/dateFormatter";

export const formatWhen = (iso?: string | null): string => {
  if (!iso) return "—";
  const { date, time } = formatDateTime(iso);
  return `${date} · ${time}`;
};

export const Row = ({
  label,
  value,
  palette,
}: {
  label: string;
  value: string;
  palette: QueuePalette;
}) => (
  <View className="w-full flex-row items-start gap-3 py-2">
    <Text className="text-[12.5px] font-medium" style={{ color: palette.muted, width: 132 }}>
      {label}
    </Text>
    <Text className="min-w-0 flex-1 text-[13px] leading-[19px]" style={{ color: palette.heading }}>
      {value}
    </Text>
  </View>
);

export const Block = ({
  title,
  children,
  palette,
}: {
  title: string;
  children: ReactNode;
  palette: QueuePalette;
}) => (
  <View className="w-full">
    <Text
      className="mb-1 text-[12px] font-bold uppercase"
      style={{ color: palette.subtle, letterSpacing: 0.5 }}
    >
      {title}
    </Text>
    <View
      className="w-full px-3.5 py-1"
      style={{
        borderRadius: QUEUE_RADIUS.control,
        borderWidth: 1,
        borderColor: palette.panelBorder,
      }}
    >
      {children}
    </View>
  </View>
);
