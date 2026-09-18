import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { DialogActions, InlineError } from "@/components/ui/dialog/DialogPieces";
import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import type { AppointmentRecord } from "@/types/appointments.types";

import { appointmentServiceLabel, appointmentWhen } from "../../appointmentPresenter";
import { formatSlotWhen } from "./rescheduleFormat";

type Props = {
  palette: ResidentDialogPalette;
  appointment: AppointmentRecord;
  slotStart: string;
  isSubmitting: boolean;
  error: string | null;
  onBack: () => void;
  onConfirm: () => void;
};

const ScheduleRow = ({
  palette,
  caption,
  value,
  highlight = false,
}: {
  palette: ResidentDialogPalette;
  caption: string;
  value: string;
  highlight?: boolean;
}) => (
  <View
    style={{
      padding: 12,
      borderRadius: 10,
      backgroundColor: highlight ? palette.accentSoft : palette.cardRaised,
      borderColor: highlight ? palette.accent : palette.border,
      borderWidth: highlight ? 1.5 : 1,
    }}
  >
    <Text
      style={{
        fontSize: 11,
        fontWeight: highlight ? "700" : "600",
        color: highlight ? palette.accent : palette.muted,
        textTransform: "uppercase",
        letterSpacing: 0.4,
      }}
    >
      {caption}
    </Text>
    <Text
      style={{
        fontSize: highlight ? 15 : 14,
        fontWeight: highlight ? "700" : "600",
        color: palette.heading,
        marginTop: 2,
      }}
    >
      {value}
    </Text>
  </View>
);

export const RescheduleConfirmStep = ({
  palette,
  appointment,
  slotStart,
  isSubmitting,
  error,
  onBack,
  onConfirm,
}: Props) => (
  <View style={{ gap: 16 }}>
    <View
      style={{
        padding: 18,
        borderRadius: 14,
        backgroundColor: palette.accentSoft,
        borderColor: palette.accentBorder,
        borderWidth: 1,
      }}
    >
      <Text
        accessibilityRole="header"
        style={{ fontSize: 16, fontWeight: "700", color: palette.heading, textAlign: "center" }}
      >
        Reschedule Appointment?
      </Text>
      <Text style={{ fontSize: 13, color: palette.muted, textAlign: "center", marginTop: 4 }}>
        Your {appointmentServiceLabel(appointment)} appointment will be moved:
      </Text>

      <View style={{ marginTop: 14, gap: 10 }}>
        <ScheduleRow palette={palette} caption="From" value={appointmentWhen(appointment)} />
        <View style={{ alignItems: "center" }}>
          <Feather name="arrow-down" size={18} color={palette.accent} />
        </View>
        <ScheduleRow palette={palette} caption="To" value={formatSlotWhen(slotStart)} highlight />
      </View>
    </View>

    {error ? <InlineError palette={palette} message={error} /> : null}

    <DialogActions
      palette={palette}
      secondaryLabel="Go Back"
      onSecondary={onBack}
      primaryLabel={isSubmitting ? "Rescheduling..." : "Confirm Reschedule"}
      onPrimary={onConfirm}
      busy={isSubmitting}
      icon="check"
    />
  </View>
);

export default RescheduleConfirmStep;
