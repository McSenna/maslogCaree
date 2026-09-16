import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { STATUS_LABELS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { StaffAppointment } from "@/services/staffDashboardService";
import ServiceBadge from "./ServiceBadge";

const slotTime = (iso: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

const QueueRow = ({
  appointment,
  position,
  showService,
  palette,
}: {
  appointment: StaffAppointment;
  position: number;
  showService: boolean;
  palette: AdminDashboardPalette;
}) => {
  const queuePalette = useQueuePalette();
  const status = queuePalette.statuses[appointment.status] ?? queuePalette.statuses.pending;

  return (
    <View
      className="w-full flex-row items-center gap-3 rounded-xl px-3 py-2.5"
      style={{ backgroundColor: palette.divider }}
      accessibilityRole="text"
      accessibilityLabel={`Position ${position}. ${appointment.patientName}, ${appointment.serviceLabel}, ${slotTime(appointment.slotStart)}, ${STATUS_LABELS[appointment.status]}`}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.cardBg }}
      >
        <Text className="text-[12.5px] font-bold tabular-nums" style={{ color: palette.muted }}>
          {position}
        </Text>
      </View>

      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-[13.5px] font-semibold" numberOfLines={1} style={{ color: palette.heading }}>
          {appointment.patientName}
        </Text>
        <View className="flex-row flex-wrap items-center gap-1.5">
          {showService ? (
            <ServiceBadge serviceKey={appointment.consultationType} label={appointment.serviceLabel} compact />
          ) : null}
          <Text className="text-[12px] font-medium tabular-nums" style={{ color: palette.muted }}>
            {slotTime(appointment.slotStart)}
          </Text>
          {appointment.isUrgent ? (
            <Text className="text-[11.5px] font-bold" style={{ color: palette.negative }}>
              Urgent
            </Text>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1" style={{ backgroundColor: status.bg }}>
        <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.dot }} />
        <Text className="text-[11.5px] font-semibold" style={{ color: status.fg }}>
          {STATUS_LABELS[appointment.status]}
        </Text>
      </View>
    </View>
  );
};

const QueuePreviewCard = ({
  palette,
  queue,
  showService,
  limit = 5,
  onViewAll,
}: {
  palette: AdminDashboardPalette;
  queue: StaffAppointment[];
  showService: boolean;
  limit?: number;
  onViewAll: () => void;
}) => {
  const visible = queue.slice(0, limit);

  return (
    <PanelCard
      palette={palette}
      title="Patient Queue"
      icon="users"
      subtitle={
        queue.length > 0
          ? `${queue.length} ${queue.length === 1 ? "patient" : "patients"} in today's queue`
          : "Today's queue"
      }
      onViewAll={onViewAll}
      viewAllLabel="View Queue"
    >
      {visible.length === 0 ? (
        <EmptyPanelState
          palette={palette}
          icon="coffee"
          message="No patients are waiting. You're all caught up."
        />
      ) : (
        <View className="w-full gap-2">
          {visible.map((appointment, index) => (
            <QueueRow
              key={appointment._id}
              appointment={appointment}
              position={index + 1}
              showService={showService}
              palette={palette}
            />
          ))}

          {queue.length > visible.length ? (
            <Pressable
              onPress={onViewAll}
              accessibilityRole="link"
              accessibilityLabel={`View the remaining ${queue.length - visible.length} patients in the queue`}
              className="h-10 w-full flex-row items-center justify-center gap-1.5"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text className="text-[12.5px] font-semibold" style={{ color: palette.primary }}>
                {queue.length - visible.length} more waiting
              </Text>
              <Feather name="arrow-right" size={13} color={palette.primary} />
            </Pressable>
          ) : null}
        </View>
      )}
    </PanelCard>
  );
};

export default QueuePreviewCard;
