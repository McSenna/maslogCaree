import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { getServiceLabel } from "@/config/appointmentServices";
import { TYPE } from "@/theme/typography";

import { QUEUE_WAITING_TITLE, queueWaitingBody } from "../../constants/bookingCopy";
import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "../appointmentTheme";

/**
 * Stands in for the queue explanation when the resident already has a doctor
 * request waiting: one may wait at a time, so this one cannot be sent yet.
 * Amber with a clock, like the "In queue" status it refers to.
 */
export const QueueWaitingNote = ({ serviceKey }: { serviceKey: string }) => (
  <View
    accessible
    accessibilityRole="alert"
    className="flex-row items-start gap-3 p-4"
    style={{ borderRadius: APPOINTMENT_METRICS.radiusCard, backgroundColor: APPOINTMENT_COLORS.waitingBg }}
  >
    <Feather name="clock" size={18} color={APPOINTMENT_COLORS.waiting} />
    <View className="min-w-0 flex-1 gap-1">
      <Text style={[TYPE.bodyStrong, { color: APPOINTMENT_COLORS.waiting }]}>{QUEUE_WAITING_TITLE}</Text>
      <Text style={[TYPE.body, { color: APPOINTMENT_COLORS.bodyText }]}>{queueWaitingBody(getServiceLabel(serviceKey))}</Text>
    </View>
  </View>
);

export default QueueWaitingNote;
