import type { ReactNode } from "react";
import { View } from "react-native";
import type { AppointmentRecord } from "@/services/appointments";
import QueuePanel from "./QueuePanel";
import { useQueuePalette, type AppointmentStatus } from "./queueTheme";
import AppointmentCard from "./appointmentsPanel/AppointmentCard";
import {
  AppointmentsEmpty,
  AppointmentsError,
  AppointmentsSkeleton,
} from "./appointmentsPanel/AppointmentsPanelStates";
import AppointmentsTableHeader from "./appointmentsPanel/AppointmentsTableHeader";
import AppointmentsTableRow from "./appointmentsPanel/AppointmentsTableRow";
import StatusTabs from "./appointmentsPanel/StatusTabs";

type AppointmentsPanelProps = {
  appointments: AppointmentRecord[];
  statusCounts: Record<string, number>;
  activeStatus: AppointmentStatus;
  onStatusChange: (status: AppointmentStatus) => void;
  serviceLabels: Record<string, string>;
  /** Rendered in the header — the doctor's Add Mission control, or nothing. */
  headerAction?: ReactNode;
  /** Omitted by a read-only queue — see `RowActionProps`. */
  onApprove?: (appointment: AppointmentRecord) => void;
  onMore?: (appointment: AppointmentRecord) => void;
  busyId: string | null;
  /** False for a role that may read this queue but not act on it. */
  canAct: boolean;
  /** Set to make rows openable — used for completed rows, which have a record. */
  onRowPress?: (appointment: AppointmentRecord) => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  emptyMessage: string;
  /** Table above this width, cards below it. */
  asTable: boolean;
};

/**
 * The requests this role is responsible for, filtered by standing.
 *
 * A table where there is room for seven columns and cards where there is not —
 * a phone gets a card per appointment rather than a table it has to drag
 * sideways to read.
 */
export default function AppointmentsPanel({
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
}: AppointmentsPanelProps) {
  const palette = useQueuePalette();
  const actions = { onApprove, onMore, busyId, canAct, onRowPress };

  const labelFor = (appointment: AppointmentRecord) =>
    serviceLabels[appointment.consultationType] ?? appointment.consultationType;

  const renderBody = () => {
    if (error) return <AppointmentsError error={error} onRetry={onRetry} palette={palette} />;
    if (loading) return <AppointmentsSkeleton palette={palette} />;
    if (appointments.length === 0) {
      return (
        <AppointmentsEmpty
          activeStatus={activeStatus}
          message={emptyMessage}
          palette={palette}
        />
      );
    }

    if (asTable) {
      return (
        <View className="w-full px-5 pb-2">
          <AppointmentsTableHeader palette={palette} hasAction={canAct || Boolean(onRowPress)} />
          {appointments.map((appointment, position) => (
            <AppointmentsTableRow
              key={appointment._id}
              appointment={appointment}
              index={position + 1}
              serviceLabel={labelFor(appointment)}
              isLast={position === appointments.length - 1}
              palette={palette}
              {...actions}
            />
          ))}
        </View>
      );
    }

    return (
      <View className="w-full gap-2.5 p-4">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            serviceLabel={labelFor(appointment)}
            palette={palette}
            {...actions}
          />
        ))}
      </View>
    );
  };

  return (
    <QueuePanel icon="calendar" title="Appointments" trailing={headerAction} bodyPadding={false}>
      <StatusTabs
        activeStatus={activeStatus}
        onStatusChange={onStatusChange}
        statusCounts={statusCounts}
        palette={palette}
      />
      {renderBody()}
    </QueuePanel>
  );
}
