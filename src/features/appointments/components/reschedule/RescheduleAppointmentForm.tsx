import { DialogError, DialogStatus } from "@/components/ui/dialog/DialogPieces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import type { AppointmentRecord } from "@/types/appointments.types";
import { isRegularScheduleService } from "@/utils/serviceDays";

import { useRescheduleAppointment } from "../../hooks/useRescheduleAppointment";
import { RegularRescheduleForm } from "./RegularRescheduleForm";
import { RescheduleConfirmStep } from "./RescheduleConfirmStep";
import { RescheduleSelectStep } from "./RescheduleSelectStep";

export type RescheduleAppointmentFormProps = {
  appointment: AppointmentRecord;
  onSuccess: (appointment: AppointmentRecord) => void;
  onCancel: () => void;
};

const MissionRescheduleForm = ({
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
      dayChoices={form.dayChoices}
      weekly={form.weekly}
      scheduleId={form.scheduleId}
      availableSlots={form.availableSlots}
      slotStart={form.slotStart}
      assignsEarliestSlot={form.assignsEarliestSlot}
      isCurrentSlot={form.isCurrentSlot}
      error={form.submitError}
      onSelectSchedule={form.selectSchedule}
      onSelectSlot={form.selectSlot}
      onCancel={onCancel}
      onContinue={form.goToConfirm}
    />
  );
};

/** BP checking moves on its own calendar; every other service keeps its mission or weekly picker. */
export const RescheduleAppointmentForm = (props: RescheduleAppointmentFormProps) =>
  isRegularScheduleService(props.appointment.consultationType) ? (
    <RegularRescheduleForm {...props} />
  ) : (
    <MissionRescheduleForm {...props} />
  );

export default RescheduleAppointmentForm;
