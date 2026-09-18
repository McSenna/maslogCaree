import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { DialogActions, InlineError } from "@/components/ui/dialog/DialogPieces";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import type { AppointmentRecord, RescheduleOptionSchedule } from "@/types/appointments.types";

import { appointmentServiceLabel, appointmentWhen } from "../../appointmentPresenter";
import RescheduleDateList from "./RescheduleDateList";
import RescheduleTimeGrid from "./RescheduleTimeGrid";

type Props = {
  palette: ResidentDialogPalette;
  appointment: AppointmentRecord;
  schedules: RescheduleOptionSchedule[];
  scheduleId: string | null;
  availableSlots: string[];
  slotStart: string | null;
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
  schedules,
  scheduleId,
  availableSlots,
  slotStart,
  error,
  onSelectSchedule,
  onSelectSlot,
  onCancel,
  onContinue,
}: Props) => (
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

    <View accessibilityRole="radiogroup">
      <FieldLabel palette={palette}>Select New Date</FieldLabel>
      <RescheduleDateList
        palette={palette}
        schedules={schedules}
        selectedId={scheduleId}
        onSelect={onSelectSchedule}
      />
    </View>

    {scheduleId ? (
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
      primaryDisabled={!slotStart}
      icon="arrow-right"
    />
  </View>
);

export default RescheduleSelectStep;
