import { useMemo, type ReactNode } from "react";
import { View } from "react-native";

import { DataTable } from "@/components/data-table";
import type { AppointmentRecord } from "@/services/appointments";
import { appointmentPatientName } from "@/utils/appointmentPatient";

import AppointmentCard from "./appointmentsPanel/AppointmentCard";
import { appointmentColumns } from "./appointmentsPanel/appointmentColumns";
import StatusTabs from "./appointmentsPanel/StatusTabs";
import QueuePanel from "./QueuePanel";
import { STATUS_LABELS, useQueuePalette, type AppointmentStatus } from "./queueTheme";

type AppointmentsPanelProps = {
  appointments: AppointmentRecord[];
  statusCounts: Record<string, number>;
  activeStatus: AppointmentStatus;
  onStatusChange: (status: AppointmentStatus) => void;
  serviceLabels: Record<string, string>;
  headerAction?: ReactNode;
  onApprove?: (appointment: AppointmentRecord) => void;
  onMore?: (appointment: AppointmentRecord) => void;
  busyId: string | null;
  canAct: boolean;
  onRowPress?: (appointment: AppointmentRecord) => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  emptyMessage: string;
  /** Decided from the window; the table still turns into cards when the panel itself is too narrow for it. */
  asTable: boolean;
};

const AppointmentsPanel = ({
  appointments,
  statusCounts,
  activeStatus,
  onStatusChange,
  serviceLabels,
  headerAction,
  onApprove,
  onMore,
  busyId,
  canAct,
  onRowPress,
  loading,
  error,
  onRetry,
  emptyMessage,
  asTable,
}: AppointmentsPanelProps) => {
  const palette = useQueuePalette();
  const actions = { onApprove, onMore, busyId, canAct, onRowPress };
  const serviceLabelOf = (appointment: AppointmentRecord) =>
    serviceLabels[appointment.consultationType] ?? appointment.consultationType;

  const columns = useMemo(
    () =>
      appointmentColumns({
        palette,
        onApprove,
        onMore,
        busyId,
        canAct,
        onRowPress,
        serviceLabelOf: (appointment) => serviceLabels[appointment.consultationType] ?? appointment.consultationType,
      }),
    [palette, onApprove, onMore, busyId, canAct, onRowPress, serviceLabels]
  );

  return (
    <View className="w-full min-w-0">
      <QueuePanel icon="calendar" title="Appointments" trailing={headerAction} bodyPadding={false}>
        <StatusTabs activeStatus={activeStatus} onStatusChange={onStatusChange} statusCounts={statusCounts} palette={palette} />
        <View className="w-full p-3">
          <DataTable
            caption="Appointments"
            surface="plain"
            layout={asTable ? "auto" : "cards"}
            columns={columns}
            data={appointments}
            rowKey={(appointment) => appointment._id}
            loading={loading}
            error={error}
            errorTitle="Unable to load appointments."
            onRetry={onRetry}
            emptyIcon="calendar"
            emptyTitle={`No ${STATUS_LABELS[activeStatus].toLowerCase()} appointments.`}
            emptyDescription={emptyMessage}
            onRowPress={onRowPress}
            rowPressMode={canAct ? "pointer" : "button"}
            rowLabel={(appointment) => `View the medical record for ${appointmentPatientName(appointment, "this appointment")}`}
            renderMobileCard={(appointment) => (
              <AppointmentCard appointment={appointment} serviceLabel={serviceLabelOf(appointment)} palette={palette} {...actions} />
            )}
          />
        </View>
      </QueuePanel>
    </View>
  );
};

export default AppointmentsPanel;
