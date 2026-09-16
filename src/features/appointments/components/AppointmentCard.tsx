import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import { getServiceVisual, resolveVisual } from "@/config/serviceVisuals";
import type { AppointmentRecord } from "@/services/appointments";
import {
  appointmentServiceLabel,
  appointmentWhen,
  medicalRecordIdOf,
  residentStatusLabel,
  statusToneKey,
} from "../appointmentPresenter";

const AppointmentCard = ({
  appointment,
  palette,
  onOpen,
}: {
  appointment: AppointmentRecord;
  palette: QueuePalette;
  onOpen: (appointment: AppointmentRecord) => void;
}) => {
  const visual = resolveVisual(getServiceVisual(appointment.consultationType), palette.isDark);
  const service = appointmentServiceLabel(appointment);
  const status = residentStatusLabel(appointment.status);
  const tone = palette.statuses[statusToneKey(appointment.status)];
  const when = appointmentWhen(appointment);
  const hasRecord = Boolean(medicalRecordIdOf(appointment));

  return (
    <Pressable
      onPress={() => onOpen(appointment)}
      accessibilityRole="button"
      accessibilityLabel={`${service}, ${status}, ${when}.${hasRecord ? " Medical record available." : ""}`}
      accessibilityHint="Opens the appointment details"
      className="w-full gap-3 p-4 active:opacity-80"
      style={{
        borderRadius: QUEUE_RADIUS.card,
        borderWidth: 1,
        borderColor: palette.panelBorder,
        backgroundColor: palette.panelBg,
      }}
    >
      <View className="w-full flex-row items-start gap-3">
        <View
          className="items-center justify-center"
          style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: visual.tint }}
        >
          <MaterialCommunityIcons name={visual.icon} size={20} color={visual.fg} />
        </View>

        <View className="min-w-0 flex-1 gap-1">
          <Text
            className="text-[14.5px] font-bold"
            style={{ color: palette.heading }}
            numberOfLines={1}
          >
            {service}
          </Text>
          <Text className="text-[12.5px]" style={{ color: palette.muted }} numberOfLines={1}>
            {when}
          </Text>
        </View>

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

      {appointment.description ? (
        <Text className="text-[13px] leading-[19px]" style={{ color: palette.body }} numberOfLines={2}>
          {appointment.description}
        </Text>
      ) : null}

      <View
        className="w-full flex-row items-center justify-between gap-3 pt-3"
        style={{ borderTopWidth: 1, borderTopColor: palette.divider }}
      >
        {hasRecord ? (
          <View className="min-w-0 flex-1 flex-row items-center gap-1.5">
            <MaterialCommunityIcons
              name="clipboard-pulse-outline"
              size={13}
              color={palette.statuses.completed.dot}
            />
            <Text
              className="min-w-0 flex-1 text-[11.5px] font-medium"
              style={{ color: palette.statuses.completed.fg }}
              numberOfLines={1}
            >
              Medical record available
            </Text>
          </View>
        ) : (
          <View className="flex-1" />
        )}

        <View className="flex-row items-center gap-1">
          <Text className="text-[12.5px] font-semibold" style={{ color: palette.primary }}>
            Details
          </Text>
          <Feather name="chevron-right" size={15} color={palette.primary} />
        </View>
      </View>
    </Pressable>
  );
};

export default AppointmentCard;
