import { Text, View } from "react-native";
import type { AppointmentRecord } from "@/services/appointments";
import { formatDateTime } from "@/utils/dateFormatter";
import QueuePanel from "./QueuePanel";
import StatusBadge from "./StatusBadge";
import { useQueuePalette, type QueuePalette } from "./queueTheme";

function ScheduleRow({
  appointment,
  serviceLabel,
  isLast,
  palette,
}: {
  appointment: AppointmentRecord;
  serviceLabel: string;
  isLast: boolean;
  palette: QueuePalette;
}) {
  const time = appointment.slotStart ? formatDateTime(appointment.slotStart).time : "—";
  const tone = palette.statuses[appointment.status] ?? palette.statuses.pending;

  return (
    <View className="w-full flex-row items-stretch gap-3">
      <Text
        className="w-[68px] pt-3 text-right text-[12.5px] font-semibold"
        style={{ color: palette.muted }}
      >
        {time}
      </Text>

      {/* The timeline: a dot on the rule, and the rule dropped on the last row
          so the column ends rather than trailing into nothing. */}
      <View className="items-center" style={{ width: 12 }}>
        <View className="mt-4 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tone.dot }} />
        {!isLast ? (
          <View className="mt-1 w-px flex-1" style={{ backgroundColor: palette.divider }} />
        ) : null}
      </View>

      <View className={`min-w-0 flex-1 flex-row items-center gap-2 ${isLast ? "pb-1" : "pb-3"} pt-2.5`}>
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-[14px] font-semibold" style={{ color: palette.heading }}>
            {appointment.resident?.fullname || "Unnamed patient"}
          </Text>
          <Text numberOfLines={1} className="mt-0.5 text-[12.5px]" style={{ color: palette.muted }}>
            {serviceLabel}
          </Text>
        </View>
        <StatusBadge status={appointment.status} />
      </View>
    </View>
  );
}

/**
 * Today's booked appointments, earliest first.
 *
 * Ordered by the server rather than here — the list arrives sorted by start
 * time, so a second sort on the client could only ever disagree with it. Only
 * the signed-in role's own services appear.
 */
export default function TodaySchedulePanel({
  schedule,
  serviceLabels,
  loading,
  emptyMessage,
  dateLabel,
}: {
  schedule: AppointmentRecord[];
  /** Service key → the approved display name. */
  serviceLabels: Record<string, string>;
  loading: boolean;
  emptyMessage: string;
  dateLabel: string;
}) {
  const palette = useQueuePalette();

  return (
    <QueuePanel
      icon="calendar"
      title="Today's Schedule"
      trailing={
        <Text className="text-[12.5px] font-semibold" style={{ color: palette.muted }}>
          {dateLabel}
        </Text>
      }
    >
      {loading ? (
        <View className="gap-3 py-2">
          {[0, 1, 2].map((i) => (
            <View key={i} className="flex-row items-center gap-3">
              <View style={{ height: 12, width: 56, borderRadius: 6, backgroundColor: palette.skeleton }} />
              <View className="flex-1 gap-1.5">
                <View style={{ height: 12, width: "70%", borderRadius: 6, backgroundColor: palette.skeleton }} />
                <View style={{ height: 10, width: "45%", borderRadius: 6, backgroundColor: palette.skeleton }} />
              </View>
            </View>
          ))}
        </View>
      ) : schedule.length === 0 ? (
        <View className="items-center gap-1.5 px-4 py-9">
          <Text className="text-[13.5px] font-semibold" style={{ color: palette.heading }}>
            Nothing booked today.
          </Text>
          <Text className="text-center text-[12.5px]" style={{ color: palette.muted }}>
            {emptyMessage}
          </Text>
        </View>
      ) : (
        <View className="w-full py-1">
          {schedule.map((appointment, index) => (
            <ScheduleRow
              key={appointment._id}
              appointment={appointment}
              serviceLabel={
                serviceLabels[appointment.consultationType] ?? appointment.consultationType
              }
              isLast={index === schedule.length - 1}
              palette={palette}
            />
          ))}
        </View>
      )}
    </QueuePanel>
  );
}
