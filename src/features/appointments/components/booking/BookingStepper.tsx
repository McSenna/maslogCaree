import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { TYPE } from "@/theme/typography";

import type { BookingStage } from "../../hooks/useAppointmentBooking";
import { APPOINTMENT_COLORS } from "../appointmentTheme";

const STEPS = [
  { key: "details", label: "Details" },
  { key: "review", label: "Review" },
] as const;

type StepState = "done" | "current" | "upcoming";

// How many steps are behind the resident; a confirmed booking has finished both.
const REACHED: Record<BookingStage, number> = { details: 0, review: 1, confirmed: 2 };

const stateOf = (index: number, stage: BookingStage): StepState => {
  const reached = REACHED[stage];
  if (index < reached) return "done";
  return index === reached ? "current" : "upcoming";
};

const STATE_TEXT: Record<StepState, string> = { done: "completed", current: "current step", upcoming: "not started" };

const StepDot = ({ index, state }: { index: number; state: StepState }) => {
  const filled = state !== "upcoming";
  return (
    <View
      className="h-9 w-9 items-center justify-center rounded-full"
      style={{ backgroundColor: filled ? APPOINTMENT_COLORS.primaryBright : APPOINTMENT_COLORS.neutralBg }}
    >
      {state === "done" ? (
        <Feather name="check" size={18} color={APPOINTMENT_COLORS.white} />
      ) : (
        <Text style={[TYPE.bodyStrong, { fontWeight: "700", color: filled ? APPOINTMENT_COLORS.white : APPOINTMENT_COLORS.bodyText }]}>{index + 1}</Text>
      )}
    </View>
  );
};

/** Where the resident is in the booking: Details, then Review. Pinned under the dialog title. */
export const BookingStepper = ({ stage }: { stage: BookingStage }) => (
  <View className="border-b px-6 pb-4 pt-2" style={{ borderColor: APPOINTMENT_COLORS.divider }}>
    <View accessibilityRole="list" accessibilityLabel="Booking steps" className="flex-row items-center justify-center gap-4 self-center">
      {STEPS.map((step, index) => {
        const state = stateOf(index, stage);
        return (
          // Each step is a list item, so the "Booking steps" list is a real list to screen readers.
          <View key={step.key} role="listitem" className="flex-row items-center gap-4">
            {index > 0 ? (
              <View
                className="h-0.5 w-12 sm:w-36"
                style={{ backgroundColor: state === "upcoming" ? APPOINTMENT_COLORS.track : APPOINTMENT_COLORS.primaryBright }}
              />
            ) : null}
            <View accessibilityRole="text" accessibilityLabel={`Step ${index + 1} of ${STEPS.length}, ${step.label}, ${STATE_TEXT[state]}`} className="flex-row items-center gap-3">
              <StepDot index={index} state={state} />
              <Text style={[TYPE.bodyLarge, { fontWeight: state === "current" ? "700" : "500", color: state === "upcoming" ? APPOINTMENT_COLORS.bodyText : APPOINTMENT_COLORS.primary }]}>
                {step.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  </View>
);

export default BookingStepper;
