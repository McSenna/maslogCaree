import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { QUEUE_RADIUS, type QueuePalette } from "../queueTheme";
import StatusBadge from "../StatusBadge";
import { scheduleFor } from "./appointmentSchedule";
import QueueAvatar from "./QueueAvatar";
import RowActions, { type RowActionProps } from "./RowActions";

type AppointmentCardProps = RowActionProps & {
  serviceLabel: string;
  palette: QueuePalette;
};

const AppointmentCard = ({
  appointment,
  serviceLabel,
  palette,
  ...actions
}: AppointmentCardProps) => {
  const when = scheduleFor(appointment);

  return (
    <View
      className="w-full gap-3 border p-3.5"
      style={{
        borderRadius: QUEUE_RADIUS.card,
        backgroundColor: palette.panelBg,
        borderColor: palette.panelBorder,
      }}
    >
      <View className="flex-row items-center gap-3">
        <QueueAvatar name={appointment.resident?.fullname ?? ""} palette={palette} />
        <View className="min-w-0 flex-1">
          <Text
            numberOfLines={1}
            className="text-[15px] font-bold"
            style={{ color: palette.heading }}
          >
            {appointment.resident?.fullname || "Unnamed patient"}
          </Text>
          <Text numberOfLines={1} className="mt-0.5 text-[13px]" style={{ color: palette.muted }}>
            {serviceLabel}
          </Text>
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

      <View
        className="flex-row items-center justify-between gap-2 pt-3"
        style={{ borderTopWidth: 1, borderTopColor: palette.divider }}
      >
        <StatusBadge status={appointment.status} />
        <RowActions appointment={appointment} {...actions} />
      </View>
    </View>
  );
};

export default AppointmentCard;
