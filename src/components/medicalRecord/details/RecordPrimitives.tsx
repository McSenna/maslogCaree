import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import { formatDateTime } from "@/utils/dateFormatter";

export const formatWhen = (iso?: string | null): string => {
  if (!iso) return "Not recorded";
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
    <Text className="text-[14.5px] font-medium" style={{ color: palette.muted, width: 132 }}>
      {label}
    </Text>
    <Text className="min-w-0 flex-1 text-[15px] leading-[21px]" style={{ color: palette.heading }}>
      {value}
    </Text>
  </View>
);

export const Block = ({
  title,
  children,
  palette,
  fill = false,
}: {
  title: string;
  children: ReactNode;
  palette: QueuePalette;
  /** Stretch to the row's height, so side-by-side blocks end on one line. */
  fill?: boolean;
}) => (
  <View className={fill ? "w-full flex-1" : "w-full"}>
    <Text
      className="mb-1 text-[14px] font-bold uppercase"
      style={{ color: palette.body, letterSpacing: 0.5 }}
    >
      {title}
    </Text>
    <View
      className={fill ? "w-full flex-1 px-3.5 py-1" : "w-full px-3.5 py-1"}
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
