import { View } from "react-native";

import { TableButton } from "@/components/data-table";
import type { AppointmentRecord } from "@/services/appointments";
import { appointmentPatientName } from "@/utils/appointmentPatient";

export type RowActionProps = {
  appointment: AppointmentRecord;
  onApprove?: (appointment: AppointmentRecord) => void;
  onMore?: (appointment: AppointmentRecord) => void;
  busyId: string | null;
  canAct: boolean;
  onRowPress?: (appointment: AppointmentRecord) => void;
};

/** Approve for a pending request, then the menu of other actions. Approve shows progress and cannot be pressed twice. */
const RowActions = ({ appointment, onApprove, onMore, busyId, canAct }: RowActionProps) => {
  if (!canAct) return null;
  const name = appointmentPatientName(appointment, "this appointment");

  return (
    <View className="flex-row items-center gap-2">
      {appointment.status === "pending" ? (
        <TableButton
          variant="primary"
          label="Approve"
          accessibilityLabel={`Approve the appointment for ${name}`}
          loading={busyId === appointment._id}
          onPress={() => onApprove?.(appointment)}
        />
      ) : null}
      <TableButton
        iconOnly
        icon="more-horizontal"
        label="More actions"
        accessibilityLabel={`More actions for ${name}`}
        onPress={() => onMore?.(appointment)}
      />
    </View>
  );
};

export default RowActions;
