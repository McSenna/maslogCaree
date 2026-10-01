import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { TYPE } from "@/theme/typography";

type Props = {
  palette: ResidentDialogPalette;
  message: string;
};

/** Says up front why a fixed-day service lists only some dates. */
export const ServiceDayNote = ({ palette, message }: Props) => (
  <View
    className="flex-row items-start gap-2 rounded-md border p-3"
    style={{ backgroundColor: palette.accentSoft, borderColor: palette.accentBorder }}
  >
    <View className="pt-0.5">
      <Feather name="calendar" size={16} color={palette.accent} />
    </View>
    <Text className="min-w-0 flex-1" style={[TYPE.body, { color: palette.body }]}>
      {message}
    </Text>
  </View>
);

export default ServiceDayNote;
