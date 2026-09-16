import { Pressable, Text, View } from "react-native";
import type { AppointmentRecord } from "@/services/appointments";
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
  const { catalogue, actions, selectedMission, timeline } = control;

  return (
    <>
      <View>
        <Text className="text-2xl font-bold text-slate-900">Mission &amp; queue</Text>
        <Text className="mt-1 text-sm text-slate-600">
          Assign queued patients to validated time slots (no overlaps). New schedules are
          created from Add Mission.
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
        <BookedTimelinePanel
          timeline={timeline}
          onReschedule={(appointment) => onAssign(appointment, "reassign")}
        />
      ) : null}

      {catalogue.analytics.length > 0 ? (
        <MissionAnalyticsPanel rows={catalogue.analytics} />
      ) : null}

      <PendingQueuePanel
        pending={catalogue.pending}
        onAssign={(appointment) => onAssign(appointment, "assign")}
        onDecline={actions.declineAppointment}
      />

      <Pressable
        onPress={() => void catalogue.refreshLists()}
        accessibilityRole="button"
        className="items-center rounded-xl border border-slate-300 py-3"
      >
        <Text className="font-medium text-slate-700">Refresh data</Text>
      </Pressable>
    </>
  );
};

export default MissionWorkspace;
