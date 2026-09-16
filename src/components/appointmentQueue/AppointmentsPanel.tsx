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
};

export default AppointmentsPanel;
