import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { focusRing } from "@/components/data-table/focusRing";
import { useInteractionState } from "@/hooks/useInteractionState";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

import type { AppointmentBooking } from "../../hooks/useAppointmentBooking";
import AppointmentAlert from "../AppointmentAlert";
import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "../appointmentTheme";
import { QUEUE_REVIEW_NOTE } from "../../constants/bookingCopy";
import { FormSection } from "./FormSection";
import { reviewRows } from "./reviewDetails";

const EditButton = ({ onPress }: { onPress: () => void }) => {
  const { hovered, focused, handlers } = useInteractionState();
  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Edit appointment details"
      className="min-h-11 flex-row items-center gap-2 self-start rounded-lg px-1"
      style={[focused ? focusRing(APPOINTMENT_COLORS.primaryBright) : null, webStyle({ cursor: "pointer" })]}
    >
      <Feather name="edit-2" size={16} color={APPOINTMENT_COLORS.primaryBright} />
      <Text style={[TYPE.bodyStrong, { color: APPOINTMENT_COLORS.primaryBright, textDecorationLine: hovered ? "underline" : "none" }]}>Edit details</Text>
    </Pressable>
  );
};

/** Step 2: what will be booked or requested, read back before anything is saved. */
export const BookingReviewStep = ({ booking }: { booking: AppointmentBooking }) => {
  const rows = reviewRows(booking);

  return (
    <View className="gap-5">
      <FormSection title="Review your appointment">
        <View className="border px-4" style={{ borderRadius: APPOINTMENT_METRICS.radiusCard, borderColor: APPOINTMENT_COLORS.border }}>
          {rows.map((row, index) => (
            <View
              key={row.label}
              accessible
              accessibilityLabel={`${row.label}: ${row.value}`}
              className={index === 0 ? "gap-1 py-3" : "gap-1 border-t py-3"}
              style={{ borderColor: APPOINTMENT_COLORS.divider }}
            >
              <Text style={[TYPE.caption, { color: APPOINTMENT_COLORS.bodyText }]}>{row.label}</Text>
              <Text style={[TYPE.bodyStrong, { color: APPOINTMENT_COLORS.primary }]}>{row.value}</Text>
            </View>
          ))}
        </View>
        <EditButton onPress={booking.backToDetails} />
      </FormSection>

      <View className="flex-row items-start gap-3">
        <Feather name="info" size={18} color={APPOINTMENT_COLORS.primaryBright} />
        <Text className="min-w-0 flex-1" style={[TYPE.body, { color: APPOINTMENT_COLORS.bodyText }]}>
          {booking.queued ? QUEUE_REVIEW_NOTE : "Your time is held once you book. If someone books it first, you will be asked to choose another time."}
        </Text>
      </View>

      {booking.submitError ? <AppointmentAlert tone="danger" message={booking.submitError} /> : null}
    </View>
  );
};

export default BookingReviewStep;
