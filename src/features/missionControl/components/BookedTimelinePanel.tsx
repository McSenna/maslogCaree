import { Text, View } from "react-native";
import AnimatedListItem from "@/components/animations/AnimatedListItem";
import Button from "@/components/buttons/Button";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { AppointmentRecord } from "@/services/appointments";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { formatSlotLabel } from "../utils/slotLabels";
import WorkspacePanel, { PanelEmpty } from "./WorkspacePanel";

type BookedTimelinePanelProps = {
  timeline: AppointmentRecord[];
  onReschedule: (appointment: AppointmentRecord) => void;
};

const BookedTimelinePanel = ({ timeline, onReschedule }: BookedTimelinePanelProps) => {
  const colors = useThemeColors();

  return (
    <WorkspacePanel title="Booked timeline">
      {timeline.length === 0 ? (
        <PanelEmpty>No confirmed slots yet.</PanelEmpty>
      ) : (
        timeline.map((appointment, index) => (
          <AnimatedListItem
            key={appointment._id}
            index={index}
            style={{ gap: SPACING.xs, paddingBottom: SPACING.sm, borderBottomWidth: 1, borderBottomColor: colors.divider }}
          >
            <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: SPACING.sm }}>
              <Text style={[TYPE.bodyStrong, { color: colors.heading }]}>
                {appointment.slotStart ? formatSlotLabel(appointment.slotStart) : "—"}
              </Text>
              <AppointmentStatusBadge status={appointment.status} />
            </View>
            <Text style={[TYPE.body, { color: colors.body }]}>
              {appointment.resident?.fullname ?? "Patient"} · {appointment.assignedCategoryKey ?? appointment.consultationType}
            </Text>
            <Button variant="text" size="sm" label="Reschedule" onPress={() => onReschedule(appointment)} />
          </AnimatedListItem>
        ))
      )}
    </WorkspacePanel>
  );
};

export default BookedTimelinePanel;
