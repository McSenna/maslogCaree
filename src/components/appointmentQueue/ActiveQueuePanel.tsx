import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { AppointmentRecord } from "@/services/appointments";
import { formatDateTime } from "@/utils/dateFormatter";
import QueuePanel from "./QueuePanel";
import StatusBadge from "./StatusBadge";
import { QUEUE_RADIUS, useQueuePalette, type QueuePalette } from "./queueTheme";

function QueueNumber({ index, palette }: { index: number; palette: QueuePalette }) {
  return (
    <View
      className="h-11 w-11 items-center justify-center"
      style={{ borderRadius: QUEUE_RADIUS.control, backgroundColor: palette.primarySoft }}
    >
      <Text className="text-[10px] font-semibold" style={{ color: palette.primary, opacity: 0.75 }}>
        #
      </Text>
      <Text className="text-[14px] font-bold leading-[16px]" style={{ color: palette.primary }}>
        {String(index).padStart(2, "0")}
      </Text>
    </View>
  );
}

/**
 * One patient waiting to be seen.
 *
 * The position number is the row's place in today's ordering, not a stored
 * ticket — this system issues no queue numbers, and a card that showed one
 * would imply a check-in desk that does not exist. It is a reading aid for
 * "who is next", which is exactly what the list is sorted by.
 */
function QueueRow({
  appointment,
  index,
  serviceLabel,
  isLast,
  canComplete,
  busy,
  onComplete,
  onView,
  palette,
}: {
  appointment: AppointmentRecord;
  index: number;
  serviceLabel: string;
  isLast: boolean;
  canComplete: boolean;
  busy: boolean;
  onComplete: (appointment: AppointmentRecord) => void;
  onView?: (appointment: AppointmentRecord) => void;
  palette: QueuePalette;
}) {
  const [hovered, setHovered] = useState(false);
  const time = appointment.slotStart ? formatDateTime(appointment.slotStart).time : "—";
  const isServing = appointment.status === "processing";

  return (
    <View
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="w-full flex-row items-center gap-3 px-4 py-3"
      style={{
        backgroundColor: hovered ? palette.rowHover : "transparent",
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <QueueNumber index={index} palette={palette} />

      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-2">
          <Text numberOfLines={1} className="min-w-0 flex-1 text-[14.5px] font-semibold" style={{ color: palette.heading }}>
            {appointment.resident?.fullname || "Unnamed patient"}
          </Text>
          {isServing ? <StatusBadge status="processing" /> : null}
        </View>
        <Text numberOfLines={1} className="mt-0.5 text-[12.5px]" style={{ color: palette.muted }}>
          {serviceLabel} · {time}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        {onView ? (
          <Pressable
            onPress={() => onView(appointment)}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${appointment.resident?.fullname ?? "this patient"}`}
            hitSlop={8}
            className="h-9 w-9 items-center justify-center"
            style={{ borderRadius: QUEUE_RADIUS.control, borderWidth: 1, borderColor: palette.panelBorder }}
          >
            <Feather name="eye" size={16} color={palette.muted} />
          </Pressable>
        ) : null}

        {/* Disabled while its own request is in flight — the guard against a
            double tap opening two completions for one patient. */}
        {canComplete ? (
          <Pressable
            onPress={() => !busy && onComplete(appointment)}
            disabled={busy}
            accessibilityRole="button"
            accessibilityState={{ disabled: busy }}
            accessibilityLabel={`Complete appointment for ${appointment.resident?.fullname ?? "this patient"}`}
            className="h-9 flex-row items-center justify-center gap-1.5 px-3.5"
            style={{
              borderRadius: QUEUE_RADIUS.control,
              backgroundColor: palette.primary,
              opacity: busy ? 0.55 : 1,
            }}
          >
            {busy ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Feather name="check" size={15} color="#FFFFFF" />}
            <Text className="text-[13px] font-semibold text-white">Complete</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

/**
 * The patients this role still has to see.
 *
 * Approved appointments arrive here on their own — there is no manual step
 * between scheduling and being queued, because the queue *is* the set of
 * approved appointments. Completing one removes it from this list by changing
 * its status, so the panel cannot show a patient who has already been served.
 */
export default function ActiveQueuePanel({
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
  /** False for a role that may read this queue but not close it. */
  canComplete: boolean;
  busyId: string | null;
  onComplete: (appointment: AppointmentRecord) => void;
  onView?: (appointment: AppointmentRecord) => void;
  emptyMessage: string;
}) {
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
        <View className="gap-3 px-4 py-4">
          {[0, 1, 2].map((i) => (
            <View key={i} className="flex-row items-center gap-3">
              <View style={{ height: 44, width: 44, borderRadius: 12, backgroundColor: palette.skeleton }} />
              <View className="flex-1 gap-1.5">
                <View style={{ height: 13, width: "55%", borderRadius: 6, backgroundColor: palette.skeleton }} />
                <View style={{ height: 11, width: "35%", borderRadius: 6, backgroundColor: palette.skeleton }} />
              </View>
            </View>
          ))}
        </View>
      ) : error ? (
        <View className="items-center gap-2.5 px-4 py-8">
          <Feather name="alert-circle" size={20} color={palette.muted} />
          <Text className="text-center text-[13px]" style={{ color: palette.muted }}>
            {error}
          </Text>
          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Try loading the queue again"
            className="h-9 items-center justify-center px-4"
            style={{ borderRadius: QUEUE_RADIUS.control, borderWidth: 1, borderColor: palette.panelBorder }}
          >
            <Text className="text-[13px] font-semibold" style={{ color: palette.primary }}>
              Try again
            </Text>
          </Pressable>
        </View>
      ) : appointments.length === 0 ? (
        <View className="items-center gap-2 px-4 py-9">
          <Feather name="check-circle" size={22} color={palette.tones.green.fg} />
          <Text className="text-center text-[13px]" style={{ color: palette.muted }}>
            {emptyMessage}
          </Text>
        </View>
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
}
