import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";

export type Measurement = {
  label: string;
  value: string;
  raw?: string;
  unit?: string;
};

export const RecordSection = ({
  title,
  palette,
  children,
  caption,
}: {
  title: string;
  palette: QueuePalette;
  children: ReactNode;
  caption?: string;
}) => {
  return (
    <View className="w-full gap-2">
      <View className="gap-0.5">
        <Text
          className="text-[11.5px] font-bold uppercase"
          style={{ color: palette.subtle, letterSpacing: 0.6 }}
        >
          {title}
        </Text>
        {caption ? (
          <Text className="text-[12px]" style={{ color: palette.muted }}>
            {caption}
          </Text>
        ) : null}
      </View>

      <View
        className="w-full overflow-hidden"
        style={{
          borderRadius: QUEUE_RADIUS.control,
          borderWidth: 1,
          borderColor: palette.panelBorder,
          backgroundColor: palette.isDark ? "rgba(255,255,255,0.02)" : "#FCFDFF",
        }}
      >
        {children}
      </View>
    </View>
  );
};

export const DetailRow = ({
  label,
  value,
  palette,
  stacked = false,
  last = false,
}: {
  label: string;
  value: string;
  palette: QueuePalette;
  stacked?: boolean;
  last?: boolean;
}) => {
  return (
    <View
      className={stacked ? "w-full gap-1 px-3.5 py-3" : "w-full flex-row items-start gap-3 px-3.5 py-3"}
      style={last ? undefined : { borderBottomWidth: 1, borderBottomColor: palette.divider }}
    >
      <Text
        className="text-[12.5px] font-medium"
        style={{ color: palette.muted, width: stacked ? undefined : 128 }}
      >
        {label}
      </Text>
      <Text
        className="min-w-0 flex-1 text-[13.5px] leading-[20px]"
        style={{ color: palette.heading }}
      >
        {value}
      </Text>
    </View>
  );
};

export const MeasurementTile = ({
  entry,
  palette,
}: {
  entry: Measurement;
  palette: QueuePalette;
}) => {
  return (
    <View className="min-w-0 flex-1 gap-1 px-3.5 py-3" style={{ minWidth: 104 }}>
      <Text className="text-[11.5px] font-medium" style={{ color: palette.muted }} numberOfLines={2}>
        {entry.label}
      </Text>
      <View className="flex-row items-baseline gap-1">
        <Text className="text-[18px] font-bold" style={{ color: palette.heading }}>
          {entry.raw ?? entry.value}
        </Text>
        {entry.unit ? (
          <Text className="text-[11.5px] font-medium" style={{ color: palette.subtle }}>
            {entry.unit}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export const ProseBlock = ({
  text,
  palette,
  last = false,
}: {
  text: string;
  palette: QueuePalette;
  last?: boolean;
}) => {
  return (
    <View
      className="w-full px-3.5 py-3"
      style={last ? undefined : { borderBottomWidth: 1, borderBottomColor: palette.divider }}
    >
      <Text className="text-[13.5px] leading-[21px]" style={{ color: palette.body }}>
        {text}
      </Text>
    </View>
  );
};
