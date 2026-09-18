import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";

import { DialogActions, InlineError } from "@/components/ui/dialog/DialogPieces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import type { AppointmentRecord } from "@/types/appointments.types";

import { appointmentServiceLabel, appointmentWhen } from "../../appointmentPresenter";
import CancellationReasonPicker, {
  CANCELLATION_REASONS,
  OTHER_REASON,
} from "./CancellationReasonPicker";

export type CancelAppointmentFormProps = {
  appointment: AppointmentRecord;
  isSubmitting: boolean;
  error?: string | null;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
};

export const CancelAppointmentForm = ({
  appointment,
  isSubmitting,
  error = null,
  onConfirm,
  onCancel,
}: CancelAppointmentFormProps) => {
  const palette = useResidentDialogPalette();

  const [reason, setReason] = useState<string>(CANCELLATION_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  const handleConfirm = () => {
    if (isSubmitting) return;
    onConfirm(reason === OTHER_REASON ? customReason.trim() || OTHER_REASON : reason);
  };

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
          Appointment
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "700", color: palette.heading, marginTop: 3 }}>
          {appointmentServiceLabel(appointment)}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
          <Feather name="clock" size={13} color={palette.muted} />
          <Text style={{ fontSize: 13, color: palette.body }}>{appointmentWhen(appointment)}</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 10,
          padding: 14,
          borderRadius: 12,
          backgroundColor: palette.dangerSoft,
          borderColor: palette.dangerBorder,
          borderWidth: 1,
        }}
      >
        <Feather name="alert-triangle" size={18} color={palette.danger} style={{ marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: palette.dangerFg }}>
            Are you sure you want to cancel this appointment?
          </Text>
          <Text style={{ fontSize: 12.5, color: palette.muted, marginTop: 2, lineHeight: 18 }}>
            This removes the appointment from your active schedule and releases your time slot for
            someone else.
          </Text>
        </View>
      </View>

      <CancellationReasonPicker
        palette={palette}
        selected={reason}
        customReason={customReason}
        disabled={isSubmitting}
        onSelect={setReason}
        onCustomReasonChange={setCustomReason}
      />

      {error ? <InlineError palette={palette} message={error} /> : null}

      <DialogActions
        palette={palette}
        secondaryLabel="Keep Appointment"
        onSecondary={onCancel}
        primaryLabel={isSubmitting ? "Cancelling..." : "Cancel Appointment"}
        onPrimary={handleConfirm}
        busy={isSubmitting}
        destructive
        icon="x-circle"
      />
    </View>
  );
};

export default CancelAppointmentForm;
