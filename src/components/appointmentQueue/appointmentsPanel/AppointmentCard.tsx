import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import { TYPE } from "@/theme/typography";
import { appointmentPatientName, childCaption } from "@/utils/appointmentPatient";

import type { QueuePalette } from "../queueTheme";
import { isRescheduledRequest, scheduleFor } from "./appointmentSchedule";
import QueueAvatar from "./QueueAvatar";
import RowActions, { type RowActionProps } from "./RowActions";

type AppointmentCardProps = RowActionProps & {
  serviceLabel: string;
  palette: QueuePalette;
};

/** One appointment on a phone or a narrow panel; the table's card list draws the frame around it. */
const AppointmentCard = ({ appointment, serviceLabel, palette, ...actions }: AppointmentCardProps) => {
  const when = scheduleFor(appointment);

  return (
    <View className="w-full gap-3">
      <View className="flex-row items-center gap-3">
        <QueueAvatar name={appointmentPatientName(appointment, "")} palette={palette} />
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-[15px] font-bold" style={{ color: palette.heading }}>
            {appointmentPatientName(appointment)}
          </Text>
          <Text numberOfLines={1} className="mt-0.5 text-[13px]" style={{ color: palette.muted }}>
            {isRescheduledRequest(appointment) ? `${serviceLabel} · Rescheduled` : serviceLabel}
          </Text>
          {childCaption(appointment) ? (
            <Text numberOfLines={1} style={[TYPE.caption, { color: palette.muted }]}>
              {childCaption(appointment)}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1.5">
          <Feather name="calendar" size={13} color={palette.subtle} />
          <Text className="text-[12.5px]" style={{ color: palette.body }}>
            {when.date}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Feather name="clock" size={13} color={palette.subtle} />
          <Text className="text-[12.5px]" style={{ color: palette.body }}>
            {when.time}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap items-center justify-between gap-2 border-t pt-3" style={{ borderTopColor: palette.divider }}>
        <AppointmentStatusBadge status={appointment.status} />
        <RowActions appointment={appointment} {...actions} />
      </View>
    </View>
  );
};

export default AppointmentCard;
