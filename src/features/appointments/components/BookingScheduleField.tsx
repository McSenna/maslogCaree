import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { DialogStatus, EmptyNote } from "@/components/ui/dialog/DialogPieces";
import { residentDialogPalette } from "@/design/residentDialogTheme";
import { TYPE } from "@/theme/typography";

import type { BookingSlots } from "../hooks/booking/useBookingSlots";
import { APPOINTMENT_COLORS } from "./appointmentTheme";
import AppointmentAlert from "./AppointmentAlert";
import FieldLabel from "./FieldLabel";
import { missionDayChoices } from "./reschedule/dayChoices";
import { RescheduleDateList } from "./reschedule/RescheduleDateList";
import { RescheduleTimeGrid } from "./reschedule/RescheduleTimeGrid";

// The booking screen has a fixed light surface (APPOINTMENT_COLORS), so its
// pickers take the light dialog palette rather than following the theme.
const PICKER_PALETTE = residentDialogPalette(false);

const NO_DATES_MESSAGE =
  "No dates are open for this service right now. New dates appear here when the health team schedules a mission.";

type Props = {
  hasService: boolean;
  slots: BookingSlots;
  error?: string;
  onChange: () => void;
};

const SubLabel = ({ children }: { children: string }) => (
  <Text className="mb-2" style={[TYPE.label, { color: APPOINTMENT_COLORS.bodyText }]}>
    {children}
  </Text>
);

const ScheduleChoices = ({ slots, onChange }: Pick<Props, "slots" | "onChange">) => {
  if (slots.slotsLoading) return <DialogStatus palette={PICKER_PALETTE} message="Checking open times..." />;

  if (slots.slotsError) {
    return (
      <AppointmentAlert
        tone="danger"
        message={slots.slotsError}
        action={{ label: "Retry", accessibilityLabel: "Retry loading open times", onPress: slots.retryLoad }}
      />
    );
  }

  return (
    <View className="gap-4">
      <View accessibilityRole="radiogroup" accessibilityLabel="Date">
        <SubLabel>Date</SubLabel>
        <RescheduleDateList
          palette={PICKER_PALETTE}
          options={missionDayChoices(slots.schedules)}
          selectedId={slots.scheduleId}
          emptyMessage={NO_DATES_MESSAGE}
          onSelect={(id) => {
            slots.selectSchedule(id);
            onChange();
          }}
        />
      </View>

      {slots.activeSchedule ? (
        <View accessibilityRole="radiogroup" accessibilityLabel="Time">
          <SubLabel>Time</SubLabel>
          <RescheduleTimeGrid
            palette={PICKER_PALETTE}
            slots={slots.availableSlots}
            selected={slots.slotStart}
            onSelect={(start) => {
              slots.selectSlot(start);
              onChange();
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

/** Date and time picker for a new booking: only times the server says are open are offered. */
const BookingScheduleField = ({ hasService, slots, error, onChange }: Props) => (
  <View className="w-full">
    <FieldLabel label="Date and Time" required />

    {hasService ? (
      <ScheduleChoices slots={slots} onChange={onChange} />
    ) : (
      <EmptyNote palette={PICKER_PALETTE} message="Choose a service first to see its open dates and times." />
    )}

    {error ? (
      <View className="mt-1.5 flex-row items-center gap-1.5">
        <Feather name="alert-circle" size={13} color={APPOINTMENT_COLORS.danger} />
        <Text accessibilityRole="alert" className="flex-1" style={[TYPE.caption, { color: APPOINTMENT_COLORS.danger }]}>
          {error}
        </Text>
      </View>
    ) : null}
  </View>
);

export default BookingScheduleField;
