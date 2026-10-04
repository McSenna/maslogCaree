import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import Card from "@/components/cards/Card";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import { getServiceVisual, resolveVisual } from "@/config/serviceVisuals";
import type { AppointmentRecord } from "@/services/appointments";
import {
  appointmentServiceLabel,
  appointmentSubline,
  appointmentWhen,
  canCancelAppointment,
  canRescheduleAppointment,
  medicalRecordIdOf,
  residentStatusLabel,
} from "../appointmentPresenter";
import { PALETTE, withAlpha } from "@/theme/palette";

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
  const when = appointmentWhen(appointment);
  const recordId = medicalRecordIdOf(appointment);
  const isCompleted = appointment.status === "completed";
  const showReschedule = Boolean(onReschedule) && canRescheduleAppointment(appointment);
  const showCancel = Boolean(onCancel) && canCancelAppointment(appointment);

  return (
    <Card
      onPress={() => onOpen(appointment)}
      accessibilityLabel={`${service}, ${status}, ${when}.${recordId ? " Medical record available." : ""}`}
      accessibilityHint="Opens the appointment details"
      elevated={false}
      style={{ width: "100%", gap: 12 }}
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

        <AppointmentStatusBadge status={appointment.status} audience="resident" />
      </View>

      {appointmentSubline(appointment) ? (
        <Text className="text-[13px] leading-[19px]" style={{ color: palette.body }} numberOfLines={2}>
          {appointmentSubline(appointment)}
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
                backgroundColor: palette.primarySoft,
                borderWidth: 1,
                borderColor: palette.isDark ? withAlpha(PALETTE.blue[400], 0.4) : PALETTE.blue[200],
              }}
            >
              <MaterialCommunityIcons
                name="clipboard-pulse-outline"
                size={14}
                color={palette.primary}
              />
              <Text style={{ fontSize: 12, fontWeight: "600", color: palette.primary }}>
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
                backgroundColor: palette.primarySoft,
                borderWidth: 1,
                borderColor: palette.isDark ? withAlpha(PALETTE.blue[400], 0.4) : PALETTE.blue[200],
              }}
            >
              <Feather name="calendar" size={13} color={palette.primary} />
              <Text style={{ fontSize: 12, fontWeight: "600", color: palette.primary }}>
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
                backgroundColor: palette.isDark ? withAlpha(PALETTE.red[500], 0.12) : PALETTE.red[50],
                borderWidth: 1,
                borderColor: palette.isDark ? withAlpha(PALETTE.red[500], 0.3) : PALETTE.red[200],
              }}
            >
              <Feather name="x-circle" size={13} color={PALETTE.red[600]} />
              <Text style={{ fontSize: 12, fontWeight: "600", color: PALETTE.red[700] }}>
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
    </Card>
  );
};

export default AppointmentCard;
