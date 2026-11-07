import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { TYPE } from "@/theme/typography";
import type { RegularSchedule } from "@/types/appointments.types";

type Props = {
  schedule: RegularSchedule;
  textColor: string;
  iconColor: string;
};

/**
 * Why a weekday is closed, in the server's words (prenatal: the midwife runs
 * immunization on Thursdays). Those days are already disabled in the calendar;
 * this says why, as text a screen reader reaches in order, not only as colour.
 */
export const ClosedDaysNote = ({ schedule, textColor, iconColor }: Props) => {
  const reasons = [...new Set((schedule.closedDays ?? []).map((day) => day.reason).filter(Boolean))];
  if (!reasons.length) return null;
  return (
    <View className="gap-2">
      {reasons.map((reason) => (
        <View key={reason} accessible accessibilityRole="text" className="flex-row items-start gap-2">
          {/* Centred on the first line, so the icon stays put however the reason wraps. */}
          <View className="justify-center" style={{ height: TYPE.caption.lineHeight }}>
            <Feather name="info" size={16} color={iconColor} />
          </View>
          <Text className="min-w-0 flex-1" style={[TYPE.caption, { color: textColor }]}>
            {reason}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default ClosedDaysNote;
