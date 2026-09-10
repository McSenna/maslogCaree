import { Pressable, Text, View } from "react-native";
import type { AppointmentRecord } from "@/services/appointments";
import { formatSlotLabel } from "../utils/slotLabels";

type BookedTimelinePanelProps = {
  timeline: AppointmentRecord[];
  onReschedule: (appointment: AppointmentRecord) => void;
};

/** The selected mission's confirmed slots, in the order the day runs. */
export default function BookedTimelinePanel({
  timeline,
  onReschedule,
}: BookedTimelinePanelProps) {
  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="text-lg font-semibold text-slate-900">Booked timeline</Text>

      {timeline.length === 0 ? (
        <Text className="mt-2 text-sm text-slate-500">No confirmed slots yet.</Text>
      ) : (
        timeline.map((appointment) => (
          <View key={appointment._id} className="mt-2 border-b border-slate-100 pb-2">
            <Text className="font-medium text-slate-900">
              {appointment.slotStart ? formatSlotLabel(appointment.slotStart) : "—"}
            </Text>
            <Text className="text-sm text-slate-600">
              {appointment.resident?.fullname ?? "Patient"} ·{" "}
              {appointment.assignedCategoryKey ?? appointment.consultationType} ·{" "}
              {appointment.status}
            </Text>
            <Pressable
              onPress={() => onReschedule(appointment)}
              accessibilityRole="button"
              className="mt-1 self-start"
            >
              <Text className="text-sm font-semibold text-mc-primary">Reschedule</Text>
            </Pressable>
          </View>
        ))
      )}
    </View>
  );
}
