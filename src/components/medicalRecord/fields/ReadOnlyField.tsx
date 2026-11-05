import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";

import { FieldLabel, buildShellStyle } from "./fieldShell";

type Props = { label: string; value: string; helper: string; palette: QueuePalette };

/** A value the system sets. It sits with the inputs but reads as fixed, and takes no focus. */
const ReadOnlyField = ({ label, value, helper, palette }: Props) => (
  <View accessible accessibilityRole="text" accessibilityLabel={`${label}: ${value}. ${helper}`} className="w-full">
    <FieldLabel field={{ key: label, label, type: "text" }} palette={palette} />
    <View className="min-h-11 flex-row items-center gap-2.5 px-3 py-2" style={[buildShellStyle(palette), { backgroundColor: palette.pageBg }]}>
      <Text selectable className="min-w-0 flex-1 text-[16px]" style={{ color: palette.heading }}>
        {value}
      </Text>
      <Feather name="lock" size={14} color={palette.muted} />
    </View>
    <Text className="mt-1 text-[13.5px]" style={{ color: palette.muted }}>
      {helper}
    </Text>
  </View>
);

export default ReadOnlyField;
