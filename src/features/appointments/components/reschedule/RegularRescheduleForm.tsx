import { View } from "react-native";

import { DialogActions, InlineError } from "@/components/ui/dialog/DialogPieces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import { appointmentServiceLabel } from "../../appointmentPresenter";
import { useRegularReschedule } from "../../hooks/useRegularReschedule";
import { RegularScheduleField } from "../regularSchedule/RegularScheduleField";
import { SelectedSlotSummary } from "../regularSchedule/SelectedSlotSummary";
import { CurrentAppointmentCard } from "./CurrentAppointmentCard";
import { RescheduleConfirmStep } from "./RescheduleConfirmStep";
import type { RescheduleAppointmentFormProps } from "./RescheduleAppointmentForm";

/** Reschedule for BP checking: its own calendar and times, then the usual confirm step. */
export const RegularRescheduleForm = ({ appointment, onSuccess, onCancel }: RescheduleAppointmentFormProps) => {
  const palette = useResidentDialogPalette();
  const form = useRegularReschedule(appointment, onSuccess);
  const { picker } = form;
  const serviceLabel = appointmentServiceLabel(appointment);

  if (form.step === "confirm" && picker.slotStart) {
    return (
      <RescheduleConfirmStep
        palette={palette}
        appointment={appointment}
        slotStart={picker.slotStart}
        isSubmitting={form.isSubmitting}
        error={form.submitError}
        onBack={form.goToSelect}
        onConfirm={() => void form.submit()}
      />
    );
  }

  return (
    <View className="gap-4">
      <CurrentAppointmentCard palette={palette} appointment={appointment} />
      {form.submitError ? <InlineError palette={palette} message={form.submitError} /> : null}
      {form.isCurrentSlot ? <InlineError palette={palette} message="That is your current time. Choose a different date or time." /> : null}

      <RegularScheduleField palette={palette} serviceLabel={serviceLabel} picker={picker} onChange={form.clearError} />

      {picker.dateKey && picker.selectedSlot && !form.isCurrentSlot ? (
        <SelectedSlotSummary
          palette={palette}
          serviceLabel={serviceLabel}
          caption="Your new appointment time"
          dateKey={picker.dateKey}
          slot={picker.selectedSlot}
        />
      ) : null}

      <DialogActions
        palette={palette}
        secondaryLabel="Cancel"
        onSecondary={onCancel}
        primaryLabel="Continue"
        onPrimary={form.goToConfirm}
        primaryDisabled={!picker.slotStart || form.isCurrentSlot}
        icon="arrow-right"
      />
    </View>
  );
};

export default RegularRescheduleForm;
