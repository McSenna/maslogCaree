import { Pressable, Text, View } from "react-native";
import type { AppointmentRecord } from "@/services/appointments";
import { formatPriorityTier } from "../utils/slotLabels";

type PendingQueuePanelProps = {
  pending: AppointmentRecord[];
  onAssign: (appointment: AppointmentRecord) => void;
  onDecline: (appointment: AppointmentRecord) => void;
};

/**
 * Requests waiting for a slot, in the server's priority order.
 *
 * The order is not re-sorted here: the server ranks by priority tier and then
 * by arrival, and re-deriving that on the client would eventually disagree
 * with the ordering the rest of the system uses.
 */
export default function PendingQueuePanel({
  pending,
  onAssign,
  onDecline,
}: PendingQueuePanelProps) {
  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="text-lg font-semibold text-slate-900">Pending queue (priority)</Text>
      <Text className="mb-2 text-xs text-slate-500">Sorted: priority tier, then first-come.</Text>

      {pending.length === 0 ? (
        <Text className="text-sm text-slate-500">Queue is empty.</Text>
      ) : (
        pending.map((appointment) => (
          <View key={appointment._id} className="mb-3 border-b border-slate-100 pb-3">
            <Text className="font-semibold text-slate-900">
              {appointment.resident?.fullname ?? "Resident"}
            </Text>
            <Text className="text-xs text-slate-500">
              {formatPriorityTier(appointment.ageTier)} · requested:{" "}
              {appointment.consultationType}
              {appointment.isUrgent ? " · URGENT" : ""}
            </Text>
            <Text className="mt-1 text-sm text-slate-700">{appointment.description || "—"}</Text>

            <View className="mt-2 flex-row flex-wrap gap-2">
              <Pressable
                onPress={() => onAssign(appointment)}
                accessibilityRole="button"
                className="rounded-lg bg-mc-primary px-3 py-2"
              >
                <Text className="text-sm font-semibold text-white">Assign slot</Text>
              </Pressable>
              <Pressable
                onPress={() => onDecline(appointment)}
                accessibilityRole="button"
                className="rounded-lg border border-red-200 px-3 py-2"
              >
                <Text className="text-sm font-semibold text-red-600">Decline</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
