import AnimatedListItem from "@/components/animations/AnimatedListItem";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { AppointmentRecord } from "@/services/appointments";
import { SPACING } from "@/theme/spacing";
import { PendingQueueRow } from "./PendingQueueRow";
import WorkspacePanel, { PanelEmpty } from "./WorkspacePanel";

type PendingQueuePanelProps = {
  pending: AppointmentRecord[];
  onAssign: (appointment: AppointmentRecord) => void;
  onDecline: (appointment: AppointmentRecord) => void;
};

const PendingQueuePanel = ({ pending, onAssign, onDecline }: PendingQueuePanelProps) => {
  const colors = useThemeColors();

  return (
    <WorkspacePanel
      title="Pending queue"
      subtitle="Listed in the order the queue schedules them: rescheduled immunizations, then age group (infants, adults 60 and older, children, adolescents, adults), then earliest request."
    >
      {pending.length === 0 ? (
        <PanelEmpty>No residents are waiting for a slot.</PanelEmpty>
      ) : (
        pending.map((appointment, index) => (
          <AnimatedListItem
            key={appointment._id}
            index={index}
            style={{ paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: colors.divider }}
          >
            <PendingQueueRow appointment={appointment} onAssign={onAssign} onDecline={onDecline} />
          </AnimatedListItem>
        ))
      )}
    </WorkspacePanel>
  );
};

export default PendingQueuePanel;
