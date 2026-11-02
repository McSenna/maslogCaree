import { TableButton } from "@/components/data-table";
import type { AppointmentRecord } from "@/services/appointments";
import { appointmentPatientName } from "@/utils/appointmentPatient";

export type RowActionProps = {
  appointment: AppointmentRecord;
  onApprove?: (appointment: AppointmentRecord) => void;
  onReschedule?: (appointment: AppointmentRecord) => void;
  busyId: string | null;
  canAct: boolean;
  onRowPress?: (appointment: AppointmentRecord) => void;
};

/** A pending request can be approved into a slot; any other row can be rescheduled. Both show on the row. */
const RowActions = ({ appointment, onApprove, onReschedule, busyId, canAct }: RowActionProps) => {
  if (!canAct) return null;
  const name = appointmentPatientName(appointment, "this appointment");

  if (appointment.status === "pending") {
    return (
      <TableButton
        variant="primary"
        label="Approve"
        accessibilityLabel={`Approve the appointment for ${name}`}
        loading={busyId === appointment._id}
        onPress={() => onApprove?.(appointment)}
      />
    );
  }

  return (
    <TableButton
      icon="calendar"
      label="Reschedule"
      accessibilityLabel={`Reschedule the appointment for ${name}`}
      loading={busyId === appointment._id}
      onPress={() => onReschedule?.(appointment)}
    />
  );
};

export default RowActions;
