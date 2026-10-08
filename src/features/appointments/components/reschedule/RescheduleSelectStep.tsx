import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { DialogActions, InlineError } from "@/components/ui/dialog/DialogPieces";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import type { AppointmentRecord } from "@/types/appointments.types";
import { serviceDayNote } from "@/utils/serviceDays";

import { appointmentServiceLabel, appointmentWhen } from "../../appointmentPresenter";
import type { DayChoice } from "./dayChoices";
import { FirstSlotCard } from "./FirstSlotCard";
import { RescheduleDateList } from "./RescheduleDateList";
import { RescheduleTimeGrid } from "./RescheduleTimeGrid";
import { ServiceDayNote } from "./ServiceDayNote";

type Props = {
  palette: ResidentDialogPalette;
  appointment: AppointmentRecord;
  dayChoices: DayChoice[];
  /** A weekly service (immunization): Thursdays on its own schedule, time assigned on save. */
  weekly: boolean;
  scheduleId: string | null;
  availableSlots: string[];
  slotStart: string | null;
  assignsEarliestSlot: boolean;
  isCurrentSlot: boolean;
  error: string | null;
  onSelectSchedule: (id: string) => void;
  onSelectSlot: (slotStart: string) => void;
  onCancel: () => void;
  onContinue: () => void;
};

const FieldLabel = ({
  palette,
  children,
}: {
  palette: ResidentDialogPalette;
  children: string;
}) => (
  <Text style={{ fontSize: 13, fontWeight: "600", color: palette.heading, marginBottom: 8 }}>
    {children}
  </Text>
);

export const RescheduleSelectStep = ({
  palette,
  appointment,
  dayChoices,
  weekly,
  scheduleId,
  availableSlots,
  slotStart,
  assignsEarliestSlot,
  isCurrentSlot,
  error,
  onSelectSchedule,
  onSelectSlot,
  onCancel,
  onContinue,
}: Props) => {
  const dayNote = serviceDayNote(appointment.consultationType, appointmentServiceLabel(appointment));

  return (
    <View style={{ gap: 16 }}>
      <View
        style={{
          padding: 14,
          borderRadius: 12,
          backgroundColor: palette.card,
          borderColor: palette.border,
          borderWidth: 1,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "600",
            color: palette.muted,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          Current Appointment
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "700", color: palette.heading, marginTop: 2 }}>
          {appointmentServiceLabel(appointment)}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
          <Feather name="clock" size={13} color={palette.muted} />
          <Text style={{ fontSize: 13, color: palette.body }}>{appointmentWhen(appointment)}</Text>
        </View>
      </View>

      {error ? <InlineError palette={palette} message={error} /> : null}

      {dayNote ? <ServiceDayNote palette={palette} message={dayNote} /> : null}

      <View accessibilityRole="radiogroup">
        <FieldLabel palette={palette}>{weekly ? "Select New Thursday" : "Select New Date"}</FieldLabel>
        <RescheduleDateList
          palette={palette}
          options={dayChoices}
          emptyMessage={weekly ? "Every Thursday in the next 8 weeks is full. Please check again later." : undefined}
          selectedId={scheduleId}
          onSelect={onSelectSchedule}
        />
      </View>

      {scheduleId && assignsEarliestSlot ? (
        <View>
          <FieldLabel palette={palette}>Your Time</FieldLabel>
          <FirstSlotCard
            palette={palette}
            serviceLabel={appointmentServiceLabel(appointment)}
            slotStart={slotStart}
            isCurrentSlot={isCurrentSlot}
            explanation={weekly ? "Your new time is assigned when you confirm: the earliest open time on that Thursday." : undefined}
          />
        </View>
      ) : null}

      {scheduleId && !assignsEarliestSlot ? (
        <View accessibilityRole="radiogroup">
          <FieldLabel palette={palette}>Select Available Time</FieldLabel>
          <RescheduleTimeGrid
            palette={palette}
            slots={availableSlots}
            selected={slotStart}
            onSelect={onSelectSlot}
          />
        </View>
      ) : null}

      <DialogActions
        palette={palette}
        secondaryLabel="Cancel"
        onSecondary={onCancel}
        primaryLabel="Continue"
        onPrimary={onContinue}
        primaryDisabled={!slotStart || isCurrentSlot}
        icon="arrow-right"
      />
    </View>
  );
};

export default RescheduleSelectStep;
