import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { TYPE } from "@/theme/typography";
import type { RegularSchedule } from "@/types/appointments.types";

import { scheduleLines } from "../../regularSchedule/scheduleFormat";

type Props = {
  palette: ResidentDialogPalette;
  serviceLabel: string;
  schedule: RegularSchedule;
};

/** The opening hours up front, so a resident knows why some days and times are not offered. */
export const ScheduleHoursNote = ({ palette, serviceLabel, schedule }: Props) => (
  <View
    accessibilityRole="summary"
    className="gap-3 rounded-lg border p-3"
    style={{ backgroundColor: palette.accentSoft, borderColor: palette.accentBorder }}
  >
    <View className="flex-row items-center gap-2">
      <Feather name="clock" size={16} color={palette.accent} />
      <Text accessibilityRole="header" className="min-w-0 flex-1" style={[TYPE.label, { color: palette.heading }]}>
        {`${serviceLabel} hours`}
      </Text>
    </View>

    <View className="gap-2">
      {scheduleLines(schedule).map((line) => (
        <View key={line.label} className="flex-row flex-wrap gap-x-2">
          <Text style={[TYPE.bodyStrong, { color: palette.heading }]}>{`${line.label}:`}</Text>
          <Text className="min-w-0 shrink" style={[TYPE.body, { color: palette.body }]}>
            {line.value}
          </Text>
        </View>
      ))}
    </View>

    <Text style={[TYPE.caption, { color: palette.body }]}>
      {`Each appointment is ${schedule.intervalMinutes} minutes. Pick any open date and time.`}
    </Text>
  </View>
);

export default ScheduleHoursNote;
