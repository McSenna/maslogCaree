import { Text, View } from "react-native";

import { DialogStatus } from "@/components/ui/dialog/DialogPieces";
import { residentDialogPalette } from "@/design/residentDialogTheme";
import { TYPE } from "@/theme/typography";

import type { WeeklyBookingDays } from "../hooks/booking/useWeeklyBookingDays";
import { APPOINTMENT_COLORS } from "./appointmentTheme";
import AppointmentAlert from "./AppointmentAlert";
import FieldErrorText from "./FieldErrorText";
import FieldLabel from "./FieldLabel";
import { FirstSlotCard } from "./reschedule/FirstSlotCard";
import { weeklyDayChoices } from "./reschedule/dayChoices";
import { RescheduleDateList } from "./reschedule/RescheduleDateList";

// The booking screen has a fixed light surface, so its pickers use the light dialog palette.
const PICKER_PALETTE = residentDialogPalette(false);

type Props = { weeklyDays: WeeklyBookingDays; serviceLabel: string; error?: string; onChange: () => void };

/**
 * A Thursday, never a time: the earliest open Thursday is preselected, and the
 * card shows the time the next booking would get right now. The server assigns
 * the real time when the booking is confirmed.
 */
const WeeklyScheduleField = ({ weeklyDays, serviceLabel, error, onChange }: Props) => {
  const interval = weeklyDays.intervalMinutes ?? 10;

  const body = (() => {
    if (weeklyDays.daysLoading) return <DialogStatus palette={PICKER_PALETTE} message="Checking open Thursdays..." />;
    if (weeklyDays.daysError) {
      return (
        <AppointmentAlert
          tone="danger"
          message={weeklyDays.daysError}
          action={{ label: "Retry", accessibilityLabel: "Retry loading open Thursdays", onPress: weeklyDays.reload }}
        />
      );
    }
    return (
      <View className="gap-3">
        <View accessibilityRole="radiogroup" accessibilityLabel="Thursday">
          <RescheduleDateList
            palette={PICKER_PALETTE}
            options={weeklyDayChoices(weeklyDays.days)}
            selectedId={weeklyDays.dateKey}
            emptyMessage="Every Thursday in the next 8 weeks is full. Please check again later."
            onSelect={(dateKey) => {
              weeklyDays.selectDay(dateKey);
              onChange();
            }}
          />
        </View>
        {weeklyDays.selectedDay ? (
          <FirstSlotCard
            palette={PICKER_PALETTE}
            label="Estimated time"
            serviceLabel={serviceLabel}
            slotStart={weeklyDays.selectedDay.nextStart}
            isCurrentSlot={false}
            explanation={`Assigned automatically when you confirm: the earliest open time is yours. Visits are ${interval} minutes.`}
          />
        ) : null}
      </View>
    );
  })();

  return (
    <View className="w-full gap-2">
      <FieldLabel label="Appointment Date" required />
      <AppointmentAlert
        tone="info"
        message={`${serviceLabel} is every Thursday morning, first come, first served. You pick the Thursday; the time is assigned for you.`}
      />
      {weeklyDays.days.length > 0 && !weeklyDays.daysLoading ? (
        <Text style={[TYPE.caption, { color: APPOINTMENT_COLORS.mutedText }]}>The earliest Thursday with open times is selected.</Text>
      ) : null}
      {body}
      <FieldErrorText message={error} />
    </View>
  );
};

export default WeeklyScheduleField;
