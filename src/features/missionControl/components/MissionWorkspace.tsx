import { useState } from "react";
import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { AppointmentRecord } from "@/services/appointments";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import type { MissionControl } from "../hooks/useMissionControl";
import BookedTimelinePanel from "./BookedTimelinePanel";
import MissionAnalyticsPanel from "./MissionAnalyticsPanel";
import MissionSelectorPanel from "./MissionSelectorPanel";
import PendingQueuePanel from "./PendingQueuePanel";

type MissionWorkspaceProps = {
  control: MissionControl;
  onAssign: (appointment: AppointmentRecord, mode: "assign" | "reassign") => void;
};

const MissionWorkspace = ({ control, onAssign }: MissionWorkspaceProps) => {
  const colors = useThemeColors();
  const { catalogue, actions, selectedMission, timeline } = control;
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await catalogue.refreshLists();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={{ gap: SPACING.lg }}>
      <View style={{ gap: SPACING.xs }}>
        <Text accessibilityRole="header" style={[TYPE.headline, { color: colors.heading }]}>
          Mission &amp; queue
        </Text>
        <Text style={[TYPE.body, { color: colors.muted }]}>
          Assign queued patients to validated time slots (no overlaps). New schedules are created from Add Mission.
        </Text>
      </View>

      <MissionSelectorPanel
        missions={catalogue.missions}
        selectedMissionId={catalogue.selectedMissionId}
        onSelect={catalogue.setSelectedMissionId}
        onEdit={actions.openEdit}
        onDelete={actions.deleteMission}
      />

      {selectedMission && catalogue.missionDetail ? (
        <BookedTimelinePanel timeline={timeline} onReschedule={(appointment) => onAssign(appointment, "reassign")} />
      ) : null}

      {catalogue.analytics.length > 0 ? <MissionAnalyticsPanel rows={catalogue.analytics} /> : null}

      <PendingQueuePanel
        pending={catalogue.pending}
        onAssign={(appointment) => onAssign(appointment, "assign")}
        onDecline={actions.declineAppointment}
      />

      <Button
        variant="secondary"
        icon="refresh-cw"
        label="Refresh data"
        loadingLabel="Refreshing…"
        loading={refreshing}
        fullWidth
        onPress={() => void refresh()}
      />
    </View>
  );
};

export default MissionWorkspace;
