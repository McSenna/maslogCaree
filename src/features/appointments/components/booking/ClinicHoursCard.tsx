import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { PALETTE } from "@/theme/palette";
import { TYPE } from "@/theme/typography";
import type { RegularSchedule } from "@/types/appointments.types";

import { clinicHoursRows } from "../../regularSchedule/clinicHours";
import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "../appointmentTheme";

/** Opening hours as label and value rows, built only from the server's schedule. */
export const ClinicHoursRows = ({ schedule }: { schedule: RegularSchedule }) => {
  const rows = clinicHoursRows(schedule);
  return (
    <View>
      {rows.map((row) => (
        <View
          key={row.key}
          accessible
          accessibilityLabel={row.spoken}
          className="flex-row gap-3 border-b py-3"
          style={{ borderColor: APPOINTMENT_COLORS.border }}
        >
          <Text className="w-28" style={[TYPE.bodyStrong, { fontWeight: "700", color: APPOINTMENT_COLORS.primary }]}>
            {row.label}
          </Text>
          <View className="min-w-0 flex-1">
            {row.lines.map((line) => (
              // Times read as values; notes such as "Half day" are quieter but
              // still 4.5:1 on the grey card (slate 500 would fall just short).
              <Text key={line} style={[TYPE.body, { color: /\d/.test(line) ? APPOINTMENT_COLORS.bodyText : PALETTE.slate[600] }]}>
                {line}
              </Text>
            ))}
          </View>
        </View>
      ))}
      <View className="flex-row items-center gap-3 pt-4">
        <Feather name="clock" size={18} color={APPOINTMENT_COLORS.mutedText} />
        <Text className="min-w-0 flex-1" style={[TYPE.body, { color: APPOINTMENT_COLORS.bodyText }]}>
          {`Each appointment is ${schedule.intervalMinutes} minutes.`}
        </Text>
      </View>
    </View>
  );
};

type CardProps = { title: string; children: ReactNode };

/** The grey sidebar card next to the form on wide screens. */
export const SidebarCard = ({ title, children }: CardProps) => (
  <View className="flex-1 gap-2 p-4" style={{ borderRadius: APPOINTMENT_METRICS.radiusCard, backgroundColor: APPOINTMENT_COLORS.neutralBg }}>
    <Text accessibilityRole="header" style={[TYPE.title, { color: APPOINTMENT_COLORS.primary }]}>
      {title}
    </Text>
    {children}
  </View>
);

export const SidebarNote = ({ text }: { text: string }) => (
  <Text style={[TYPE.body, { color: APPOINTMENT_COLORS.bodyText }]}>{text}</Text>
);
