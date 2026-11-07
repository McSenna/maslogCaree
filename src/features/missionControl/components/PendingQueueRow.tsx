import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import { getServiceLabel } from "@/config/appointmentServices";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { AppointmentRecord } from "@/services/appointments";
import { TYPE } from "@/theme/typography";
import { appointmentPatientName, childCaption } from "@/utils/appointmentPatient";
import { isAssignedTimeService, isWeeklyService, serviceDayWord } from "@/utils/serviceDays";

import { needsBirthDate, priorityGroupText, waitReasonText } from "../utils/queueLabels";
import { formatSlotLabel } from "../utils/slotLabels";

type Props = {
  appointment: AppointmentRecord;
  onAssign: (appointment: AppointmentRecord) => void;
  onDecline: (appointment: AppointmentRecord) => void;
};

/**
 * One waiting request: who, which group it ranks in, what and when it was
 * asked for, and why it has no time yet. No position number is shown, because
 * a later infant or senior request can move ahead of it.
 */
export const PendingQueueRow = ({ appointment, onAssign, onDecline }: Props) => {
  const colors = useThemeColors();
  const serviceLabel = getServiceLabel(appointment.consultationType) || appointment.consultationType;
  const waiting = waitReasonText(appointment.queueWaitReason, serviceLabel);
  const flagged = needsBirthDate(appointment);
  const requestedAt = appointment.createdAt ? `Requested ${formatSlotLabel(appointment.createdAt)}` : null;

  return (
    <View className="gap-1">
      <Text style={[TYPE.bodyStrong, { color: colors.heading }]}>{appointmentPatientName(appointment, "Resident")}</Text>
      <View className="flex-row flex-wrap items-center gap-x-2 gap-y-1">
        {flagged ? <Feather name="alert-circle" size={14} color={colors.warning.fg} /> : null}
        <Text style={[TYPE.caption, { color: flagged ? colors.warning.fg : colors.heading, fontWeight: "700" }]}>
          {priorityGroupText(appointment)}
        </Text>
        <Text style={[TYPE.caption, { color: colors.muted }]}>{serviceLabel}</Text>
        {requestedAt ? <Text style={[TYPE.caption, { color: colors.muted }]}>{requestedAt}</Text> : null}
        {appointment.reschedulePriorityAt ? <Text style={[TYPE.caption, { color: colors.heading, fontWeight: "700" }]}>Rescheduled</Text> : null}
        {appointment.isUrgent ? <Text style={[TYPE.caption, { color: colors.danger.fg, fontWeight: "700" }]}>Urgent</Text> : null}
      </View>
      {/* Immunization has no reason to show: it is identified by the child instead. */}
      <Text style={[TYPE.body, { color: colors.body }]}>
        {isAssignedTimeService(appointment.consultationType)
          ? (childCaption(appointment) ?? "Older request with no child details")
          : appointment.description || "Not set"}
      </Text>
      {waiting ? (
        <View className="flex-row items-start gap-1">
          <Feather name="clock" size={14} color={colors.muted} />
          <Text className="min-w-0 flex-1" style={[TYPE.caption, { color: colors.muted }]}>{waiting}</Text>
        </View>
      ) : null}

      <View className="mt-1 flex-row flex-wrap gap-2">
        <Button
          size="sm"
          label={isWeeklyService(appointment.consultationType) ? `Place on next open ${serviceDayWord(appointment.consultationType)}` : "Assign slot"}
          icon="calendar"
          onPress={() => onAssign(appointment)}
        />
        <Button size="sm" variant="secondary" label="Decline" onPress={() => onDecline(appointment)} />
      </View>
    </View>
  );
};

export default PendingQueueRow;
