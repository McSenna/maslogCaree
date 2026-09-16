import CompleteAppointmentModal from "@/components/medicalRecord/CompleteAppointmentModal";
import MedicalRecordDetails from "@/components/medicalRecord/MedicalRecordDetails";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { AppointmentRecord } from "@/services/appointments";
import AssignSlotModal from "../components/AssignSlotModal";
import MissionToolsSheet from "../components/MissionToolsSheet";
import MissionWorkspace from "../components/MissionWorkspace";
import EditMissionScheduleModal from "../components/missionSchedule/EditMissionScheduleModal";
import MissionFieldPicker from "../components/missionSchedule/MissionFieldPicker";
import NewMissionScheduleModal from "../components/missionSchedule/NewMissionScheduleModal";
import type { useMissionControl } from "../hooks/useMissionControl";
import type { AssignMode } from "../hooks/useSlotAssignment";
import type { MissionFormField } from "../hooks/useMissionForm";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";

type Control = ReturnType<typeof useMissionControl>;

const MissionControlModals = ({
  control,
  palette,
  insets,
  userName,
  missionToolsOpen,
  onCloseMissionTools,
  newMissionOpen,
  openAssign,
  closeEdit,
  closeNewMission,
  submitNewMission,
}: {
  control: Control;
  palette: QueuePalette;
  insets: RoleScreenInsets;
  userName: string | null;
  missionToolsOpen: boolean;
  onCloseMissionTools: () => void;
  newMissionOpen: boolean;
  openAssign: (appointment: AppointmentRecord, mode: AssignMode) => void;
  closeEdit: () => void;
  closeNewMission: () => void;
  submitNewMission: () => void;
}) => {
  const { assignment, actions, completion, catalogue, createForm, editForm, picker } = control;
  const activeForm = picker.context === "edit" ? editForm : createForm;

  return (
    <>
      <CompleteAppointmentModal
        visible={Boolean(completion.target)}
        appointment={completion.target}
        form={completion.targetForm}
        formError={completion.formsError}
        serviceLabel={
          completion.target
            ? control.serviceLabels[completion.target.consultationType] ?? "Appointment"
            : "Appointment"
        }
        providerName={userName}
        onClose={completion.closeComplete}
        onCompleted={(result) => void completion.handleCompleted(result)}
        onViewRecord={(appointment) => void completion.openRecord(appointment)}
      />

      <MedicalRecordDetails
        visible={Boolean(completion.viewing)}
        record={completion.viewing?.record ?? null}
        form={completion.viewing?.form ?? null}
        onClose={completion.closeRecord}
      />

      <MissionToolsSheet
        visible={missionToolsOpen}
        onClose={onCloseMissionTools}
        isPhone={insets.isPhone}
        palette={palette}
      >
        <MissionWorkspace control={control} onAssign={openAssign} />
      </MissionToolsSheet>

      <NewMissionScheduleModal
        visible={newMissionOpen}
        form={createForm}
        categories={catalogue.categories}
        missions={catalogue.missions}
        saving={actions.saving}
        onOpenPicker={(field: MissionFormField) => picker.open("create", field)}
        onClose={closeNewMission}
        onCreate={() => void submitNewMission()}
      />

      <EditMissionScheduleModal
        visible={actions.editOpen}
        form={editForm}
        categories={catalogue.categories}
        missions={catalogue.missions}
        editingMissionId={actions.editMissionId}
        saving={actions.saving}
        onOpenPicker={(field: MissionFormField) => picker.open("edit", field)}
        onClose={closeEdit}
        onSave={() => void actions.saveEdit()}
      />

      <AssignSlotModal
        visible={assignment.open}
        mode={assignment.mode}
        mission={control.selectedMission}
        categories={catalogue.categories}
        categoryKey={assignment.categoryKey}
        onCategoryChange={assignment.setCategoryKey}
        duration={assignment.duration}
        onDurationChange={assignment.setDuration}
        slots={assignment.slots}
        selectedSlot={assignment.selectedSlot}
        onSelectSlot={assignment.setSelectedSlot}
        loadingSlots={assignment.loadingSlots}
        saving={actions.saving}
        onLoadSlots={() => void assignment.loadSlots()}
        onClose={assignment.close}
        onSubmit={() => void assignment.submit()}
      />

      <MissionFieldPicker
        field={picker.field}
        values={activeForm.values}
        onChange={activeForm.setField}
        onDismiss={picker.close}
      />
    </>
  );
};

export default MissionControlModals;
