import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import { getServiceVisual, resolveVisual } from "@/config/serviceVisuals";
import type { AppointmentRecord } from "@/services/appointments";
import {
  appointmentServiceLabel,
  appointmentWhen,
  canCancelAppointment,
  canRescheduleAppointment,
  medicalRecordIdOf,
  residentStatusLabel,
  statusToneKey,
} from "../appointmentPresenter";

export type AppointmentCardProps = {
  appointment: AppointmentRecord;
  palette: QueuePalette;
  onOpen: (appointment: AppointmentRecord) => void;
  onReschedule?: (appointment: AppointmentRecord) => void;
  onCancel?: (appointment: AppointmentRecord) => void;
  onOpenMedicalRecord?: (recordId: string, appointment: AppointmentRecord) => void;
};

const AppointmentCard = ({
  appointment,
  palette,
  onOpen,
  onReschedule,
  onCancel,
  onOpenMedicalRecord,
}: AppointmentCardProps) => {
  const visual = resolveVisual(getServiceVisual(appointment.consultationType), palette.isDark);
  const service = appointmentServiceLabel(appointment);
  const status = residentStatusLabel(appointment.status);
  const tone = palette.statuses[statusToneKey(appointment.status)];
  const when = appointmentWhen(appointment);
  const recordId = medicalRecordIdOf(appointment);
  const isCompleted = appointment.status === "completed";
  const showReschedule = Boolean(onReschedule) && canRescheduleAppointment(appointment);
  const showCancel = Boolean(onCancel) && canCancelAppointment(appointment);

  return (
    <Pressable
      onPress={() => onOpen(appointment)}
      accessibilityRole="button"
      accessibilityLabel={`${service}, ${status}, ${when}.${recordId ? " Medical record available." : ""}`}
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

      {/* Action Strip depending on status */}
      <View
        className="w-full flex-row items-center justify-between gap-2 pt-3 flex-wrap"
        style={{ borderTopWidth: 1, borderTopColor: palette.divider }}
      >
        <View className="flex-row items-center gap-2 flex-wrap">
          {/* If completed -> View Medical Details */}
          {isCompleted && recordId && onOpenMedicalRecord ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                onOpenMedicalRecord(recordId, appointment);
              }}
              accessibilityRole="button"
              accessibilityLabel="View Medical Details"
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: palette.isDark ? "rgba(2, 132, 199, 0.2)" : "rgba(2, 132, 199, 0.1)",
                borderWidth: 1,
                borderColor: palette.isDark ? "rgba(2, 132, 199, 0.4)" : "rgba(2, 132, 199, 0.25)",
              }}
            >
              <MaterialCommunityIcons
                name="clipboard-pulse-outline"
                size={14}
                color="#0284C7"
              />
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#0284C7" }}>
                View Medical Details
              </Text>
            </Pressable>
          ) : null}

          {/* If pending / confirmed / rescheduled -> Reschedule & Cancel actions */}
          {showReschedule && onReschedule ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                onReschedule(appointment);
              }}
              accessibilityRole="button"
              accessibilityLabel="Reschedule appointment"
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: palette.isDark ? "rgba(2, 132, 199, 0.15)" : "#F0F9FF",
                borderWidth: 1,
                borderColor: palette.isDark ? "rgba(2, 132, 199, 0.3)" : "#BAE6FD",
              }}
            >
              <Feather name="calendar" size={13} color="#0284C7" />
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#0284C7" }}>
                Reschedule
              </Text>
            </Pressable>
          ) : null}

          {showCancel && onCancel ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                onCancel(appointment);
              }}
              accessibilityRole="button"
              accessibilityLabel="Cancel appointment"
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: palette.isDark ? "rgba(239, 68, 68, 0.12)" : "#FEF2F2",
                borderWidth: 1,
                borderColor: palette.isDark ? "rgba(239, 68, 68, 0.3)" : "#FECACA",
              }}
            >
              <Feather name="x-circle" size={13} color="#EF4444" />
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#EF4444" }}>
                Cancel
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View className="flex-row items-center gap-1 ml-auto">
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
