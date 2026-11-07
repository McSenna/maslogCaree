import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { TYPE } from "@/theme/typography";

import { QUEUE_NOTE_BODY, QUEUE_NOTE_TITLE, QUEUE_ORDER_NOTE } from "../../constants/bookingCopy";
import { APPOINTMENT_COLORS } from "../appointmentTheme";

/**
 * Stands where the date and time pickers are for other services, so a resident
 * sees before sending that the queue, not they, sets the time, and in what order.
 */
export const QueueSchedulingNote = () => (
  <View accessible accessibilityRole="text" className="flex-row items-start gap-3">
    <Feather name="clock" size={18} color={APPOINTMENT_COLORS.primaryBright} />
    <View className="min-w-0 flex-1 gap-1">
      <Text style={[TYPE.bodyStrong, { color: APPOINTMENT_COLORS.primary }]}>{QUEUE_NOTE_TITLE}</Text>
      <Text style={[TYPE.body, { color: APPOINTMENT_COLORS.bodyText }]}>{QUEUE_NOTE_BODY}</Text>
      <Text style={[TYPE.caption, { color: APPOINTMENT_COLORS.bodyText }]}>{QUEUE_ORDER_NOTE}</Text>
    </View>
  </View>
);

export default QueueSchedulingNote;
