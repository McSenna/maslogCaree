import { Text, View } from "react-native";
import AnimatedListItem from "@/components/animations/AnimatedListItem";
import Button from "@/components/buttons/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { AppointmentRecord } from "@/services/appointments";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { formatPriorityTier } from "../utils/slotLabels";
import WorkspacePanel, { PanelEmpty } from "./WorkspacePanel";

type PendingQueuePanelProps = {
  pending: AppointmentRecord[];
  onAssign: (appointment: AppointmentRecord) => void;
  onDecline: (appointment: AppointmentRecord) => void;
};

const PendingQueuePanel = ({ pending, onAssign, onDecline }: PendingQueuePanelProps) => {
  const colors = useThemeColors();

  return (
    <WorkspacePanel title="Pending queue" subtitle="Sorted by priority tier, then first come, first served.">
      {pending.length === 0 ? (
        <PanelEmpty>No residents are waiting for a slot.</PanelEmpty>
      ) : (
        pending.map((appointment, index) => (
          <AnimatedListItem
            key={appointment._id}
            index={index}
            style={{ gap: SPACING.xs, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: colors.divider }}
          >
            <Text style={[TYPE.bodyStrong, { color: colors.heading }]}>
              {appointment.resident?.fullname ?? "Resident"}
            </Text>
            <Text style={[TYPE.caption, { color: colors.muted }]}>
              {formatPriorityTier(appointment.ageTier)} · requested {appointment.consultationType}
              {appointment.isUrgent ? " · " : ""}
              {appointment.isUrgent ? <Text style={{ color: colors.danger.fg, fontWeight: "700" }}>Urgent</Text> : null}
            </Text>
            <Text style={[TYPE.body, { color: colors.body }]}>{appointment.description || "—"}</Text>

            <View style={{ marginTop: SPACING.xs, flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm }}>
              <Button size="sm" label="Assign slot" icon="calendar" onPress={() => onAssign(appointment)} />
              <Button size="sm" variant="secondary" label="Decline" onPress={() => onDecline(appointment)} />
            </View>
          </AnimatedListItem>
        ))
      )}
    </WorkspacePanel>
  );
};

export default PendingQueuePanel;
