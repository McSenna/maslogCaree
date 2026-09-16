import { Text, View } from "react-native";

import type { AppointmentRecord } from "@/services/appointments";

import QueuePanel from "./QueuePanel";
import { QUEUE_RADIUS, useQueuePalette } from "./queueTheme";
import QueueRow from "./activeQueue/QueueRow";
import { QueueEmptyState, QueueErrorState, QueueLoadingState } from "./activeQueue/QueueStates";

const ActiveQueuePanel = ({
  appointments,
  serviceLabels,
  loading,
  error,
  onRetry,
  canComplete,
  busyId,
  onComplete,
  onView,
  emptyMessage,
}: {
  appointments: AppointmentRecord[];
  serviceLabels: Record<string, string>;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  canComplete: boolean;
  busyId: string | null;
  onComplete: (appointment: AppointmentRecord) => void;
  onView?: (appointment: AppointmentRecord) => void;
  emptyMessage: string;
}) => {
  const palette = useQueuePalette();

  const trailing = (
    <View
      className="h-7 items-center justify-center px-2.5"
      style={{ borderRadius: QUEUE_RADIUS.pill, backgroundColor: palette.primarySoft }}
    >
      <Text className="text-[12px] font-bold" style={{ color: palette.primary }}>
        {loading ? "—" : appointments.length}
      </Text>
    </View>
  );

  return (
    <QueuePanel icon="users" title="Active Queue" trailing={trailing} bodyPadding={false}>
      {loading ? (
        <QueueLoadingState palette={palette} />
      ) : error ? (
        <QueueErrorState palette={palette} error={error} onRetry={onRetry} />
      ) : appointments.length === 0 ? (
        <QueueEmptyState palette={palette} message={emptyMessage} />
      ) : (
        <View className="w-full">
          {appointments.map((appointment, i) => (
            <QueueRow
              key={appointment._id}
              appointment={appointment}
              index={i + 1}
              serviceLabel={serviceLabels[appointment.consultationType] ?? appointment.consultationType}
              isLast={i === appointments.length - 1}
              canComplete={canComplete}
              busy={busyId === appointment._id}
              onComplete={onComplete}
              onView={onView}
              palette={palette}
            />
          ))}
        </View>
      )}
    </QueuePanel>
  );
};

export default ActiveQueuePanel;
