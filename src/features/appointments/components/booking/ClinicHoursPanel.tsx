import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { PALETTE } from "@/theme/palette";
import { RADII } from "@/theme/radius";
import { TYPE } from "@/theme/typography";
import type { RegularSchedule } from "@/types/appointments.types";

import { clinicHoursRows, type ClinicHoursRow } from "../../regularSchedule/clinicHours";
import { ClosedDaysNote } from "../regularSchedule/ClosedDaysNote";
import { APPOINTMENT_COLORS } from "../appointmentTheme";

// The inset boxes sit a step lighter than the card's hairline, as in the
// "Soft schedule" reference: open days and the visit length are framed,
// the lunch break and closed days read as plain notes between them.
const INSET = { borderColor: APPOINTMENT_COLORS.border, backgroundColor: PALETTE.slate[50], borderRadius: RADII.medium };
const ICON_SIZE = 22;

const isTime = (line: string) => /\d/.test(line);

/** The day label, its times, and quieter notes such as "Half day" or "Closed". */
const RowText = ({ row }: { row: ClinicHoursRow }) => (
  <View className="min-w-0 flex-1 gap-1">
    <Text style={[TYPE.bodyStrong, { fontWeight: "700", color: APPOINTMENT_COLORS.primary }]}>{row.label}</Text>
    <View>
      {row.lines.map((line) => (
        <Text key={line} style={[TYPE.body, { color: isTime(line) ? APPOINTMENT_COLORS.bodyText : APPOINTMENT_COLORS.mutedText }]}>
          {line}
        </Text>
      ))}
    </View>
  </View>
);

/** An open-day row: calendar icon, a thin rule, then the days and their hours. */
const OpenDayRow = ({ row, divided }: { row: ClinicHoursRow; divided: boolean }) => (
  <View
    accessible
    accessibilityLabel={row.spoken}
    className={divided ? "flex-row gap-3 border-t py-3" : "flex-row gap-3 py-3"}
    style={{ borderColor: APPOINTMENT_COLORS.divider }}
  >
    {/* Centred on the label and first time, where the eye starts reading. */}
    <View className="justify-center" style={{ height: TYPE.bodyStrong.lineHeight + TYPE.body.lineHeight + 4 }}>
      <Feather name="calendar" size={ICON_SIZE} color={APPOINTMENT_COLORS.primaryBright} />
    </View>
    <View className="w-px self-stretch" style={{ backgroundColor: APPOINTMENT_COLORS.divider }} />
    <RowText row={row} />
  </View>
);

/** A row outside the box (lunch break, closed days): text only, hairline between. */
const NoteRow = ({ row, divided }: { row: ClinicHoursRow; divided: boolean }) => (
  <View
    accessible
    accessibilityLabel={row.spoken}
    className={divided ? "border-t pt-3" : undefined}
    style={{ borderColor: APPOINTMENT_COLORS.divider }}
  >
    <RowText row={row} />
  </View>
);

/**
 * Clinic hours in the "Soft schedule" layout, built only from the server's
 * schedule: open days framed with a calendar icon, then the lunch break and
 * closed days, then the visit length. Each row keeps its spoken label, and
 * times never split from their AM or PM (clinicHours.ts).
 */
export const ClinicHoursRows = ({ schedule }: { schedule: RegularSchedule }) => {
  const rows = clinicHoursRows(schedule);
  const openDays = rows.filter((row) => row.key.startsWith("days-"));
  const notes = rows.filter((row) => !row.key.startsWith("days-"));

  return (
    <View className="gap-4">
      {openDays.length ? (
        <View className="border px-3" style={INSET}>
          {openDays.map((row, index) => (
            <OpenDayRow key={row.key} row={row} divided={index > 0} />
          ))}
        </View>
      ) : null}

      {notes.length ? (
        <View className="gap-3 px-1">
          {notes.map((row, index) => (
            <NoteRow key={row.key} row={row} divided={index > 0} />
          ))}
        </View>
      ) : null}

      <View className="flex-row items-center gap-3 border px-3 py-3" style={INSET}>
        <Feather name="clock" size={ICON_SIZE} color={APPOINTMENT_COLORS.primaryBright} />
        <Text className="min-w-0 flex-1" style={[TYPE.body, { color: APPOINTMENT_COLORS.bodyText }]}>
          {`Each appointment is ${schedule.intervalMinutes} minutes.`}
        </Text>
      </View>

      {schedule.closedDays?.length ? (
        <View className="px-1">
          <ClosedDaysNote schedule={schedule} textColor={APPOINTMENT_COLORS.bodyText} iconColor={APPOINTMENT_COLORS.mutedText} />
        </View>
      ) : null}
    </View>
  );
};

export default ClinicHoursRows;
