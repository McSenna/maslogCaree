import { Text, View } from "react-native";

import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";

/** The year above a run of records in the resident's history. */
const RecordYearHeader = ({ title, palette }: { title: string; palette: QueuePalette }) => (
  <View className="w-full flex-row items-center gap-3 pb-2 pt-4" accessibilityRole="header">
    <Text className="text-[13px] font-bold" style={{ color: palette.heading }}>
      {title}
    </Text>
    <View className="h-px flex-1" style={{ backgroundColor: palette.divider }} />
  </View>
);

export default RecordYearHeader;
