import { Pressable, Text, View } from "react-native";
import type { AppointmentRecord } from "@/services/appointments";
import type { MissionControl } from "../hooks/useMissionControl";
import type { MissionFormField } from "../hooks/useMissionForm";
import BookedTimelinePanel from "./BookedTimelinePanel";
import MissionAnalyticsPanel from "./MissionAnalyticsPanel";
import MissionSelectorPanel from "./MissionSelectorPanel";
import NewMissionPanel from "./NewMissionPanel";
import PendingQueuePanel from "./PendingQueuePanel";

type MissionWorkspaceProps = {
  /**
   * The feature controller, passed whole.
   *
   * This is the workspace's own container layer rather than a reusable
   * component, and threading its twenty-odd callbacks through as individual
   * props would say less about the screen than one named dependency does. The
   * panels below it stay plain and prop-driven.
   */
  control: MissionControl;
  onOpenPicker: (field: MissionFormField) => void;
  onAssign: (appointment: AppointmentRecord, mode: "assign" | "reassign") => void;
};

/**
 * The scheduling workflow, top to bottom: create a schedule, pick one, see
 * what is booked into it, then assign the priority queue into its slots.
 *
 * The order is the workflow — a slot cannot be assigned before a schedule
 * exists, so creating one comes first and the queue sits at the bottom where
 * the health worker ends up.
 */
export default function MissionWorkspace({
  control,
  onOpenPicker,
  onAssign,
}: MissionWorkspaceProps) {
  const { catalogue, actions, createForm, selectedMission, timeline } = control;

  return (
    <>
      <View>
        <Text className="text-2xl font-bold text-slate-900">Mission &amp; queue</Text>
        <Text className="mt-1 text-sm text-slate-600">
          Create a schedule first, then assign queued patients to validated time slots (no
          overlaps).
        </Text>
      </View>

      <NewMissionPanel
        form={createForm}
        categories={catalogue.categories}
        saving={actions.saving}
        onOpenPicker={onOpenPicker}
        onCreate={() => void actions.createMission()}
      />

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
}
