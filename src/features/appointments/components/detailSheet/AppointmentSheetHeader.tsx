import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { resolveVisual } from "@/config/serviceVisuals";

type Props = {
  visual: ReturnType<typeof resolveVisual>;
  service: string;
  status: string;
  tone: QueuePalette["statuses"][keyof QueuePalette["statuses"]];
  when: string;
  palette: QueuePalette;
  onRequestClose: () => void;
};

const AppointmentSheetHeader = ({
  visual,
  service,
  status,
  tone,
  when,
  palette,
  onRequestClose,
}: Props) => {
  return (
    <View
      className="w-full gap-3 px-5 pb-4 pt-2"
      style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
    >
      <View className="w-full flex-row items-start gap-3">
        <View
          className="items-center justify-center"
          style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: visual.tint }}
        >
          <MaterialCommunityIcons name={visual.icon} size={22} color={visual.fg} />
        </View>

        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text
              accessibilityRole="header"
              className="text-[17px] font-bold"
              style={{ color: palette.heading }}
            >
              {service}
            </Text>
            <View
              className="flex-row items-center gap-1.5 px-2.5 py-1"
              style={{ borderRadius: QUEUE_RADIUS.pill, backgroundColor: tone.bg }}
            >
              <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone.dot }} />
              <Text className="text-[11.5px] font-semibold" style={{ color: tone.fg }}>
                {status}
              </Text>
            </View>
          </View>

          <Text className="text-[12.5px]" style={{ color: palette.muted }}>
            {when}
          </Text>
        </View>

        <Pressable
          onPress={onRequestClose}
          accessibilityRole="button"
          accessibilityLabel="Close appointment details"
          hitSlop={12}
          className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
          style={{ backgroundColor: palette.skeleton }}
        >
          <Feather name="x" size={17} color={palette.muted} />
        </Pressable>
      </View>
    </View>
  );
};

export default AppointmentSheetHeader;
