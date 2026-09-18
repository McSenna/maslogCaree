import { DialogError, DialogStatus } from "@/components/ui/dialog/DialogPieces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import type { AppointmentRecord } from "@/types/appointments.types";

import { useRescheduleAppointment } from "../../hooks/useRescheduleAppointment";
import RescheduleConfirmStep from "./RescheduleConfirmStep";
import RescheduleSelectStep from "./RescheduleSelectStep";

export type RescheduleAppointmentFormProps = {
  appointment: AppointmentRecord;
  onSuccess: (appointment: AppointmentRecord) => void;
  onCancel: () => void;
};

export const RescheduleAppointmentForm = ({
  appointment,
  onSuccess,
  onCancel,
}: RescheduleAppointmentFormProps) => {
  const palette = useResidentDialogPalette();
  const form = useRescheduleAppointment(appointment, onSuccess);

  if (form.loadingOptions) {
    return <DialogStatus palette={palette} message="Checking availability..." />;
  }

  if (form.optionsError) {
    return (
      <DialogError
        palette={palette}
        title="Unable to load schedules"
        message={form.optionsError}
        actionLabel="Close"
        onAction={onCancel}
      />
    );
  }

  if (form.step === "confirm" && form.slotStart) {
    return (
      <RescheduleConfirmStep
        palette={palette}
        appointment={appointment}
        slotStart={form.slotStart}
        isSubmitting={form.isSubmitting}
        error={form.submitError}
        onBack={form.goToSelect}
        onConfirm={() => void form.submit()}
      />
    );
  }

  return (
    <RescheduleSelectStep
      palette={palette}
      appointment={appointment}
      schedules={form.schedules}
      scheduleId={form.scheduleId}
      availableSlots={form.availableSlots}
      slotStart={form.slotStart}
      error={form.submitError}
      onSelectSchedule={form.selectSchedule}
      onSelectSlot={form.selectSlot}
      onCancel={onCancel}
      onContinue={form.goToConfirm}
    />
  );
};

export default RescheduleAppointmentForm;
