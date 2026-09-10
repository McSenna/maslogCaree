import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import CompleteAppointmentModal from "@/components/medicalRecord/CompleteAppointmentModal";
import MedicalRecordDetails from "@/components/medicalRecord/MedicalRecordDetails";
import QueueStatCards from "@/components/appointmentQueue/QueueStatCards";
import {
  FOUR_CARD_WIDTH,
  TABLE_WIDTH,
  TWO_COLUMN_WIDTH,
  useQueuePalette,
} from "@/components/appointmentQueue/queueTheme";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import type { AppointmentRecord } from "@/services/appointments";
import AddMissionButton from "../components/AddMissionButton";
import AssignSlotModal from "../components/AssignSlotModal";
import EditMissionModal from "../components/EditMissionModal";
import MissionDateTimePicker from "../components/MissionDateTimePicker";
import MissionToolsSheet from "../components/MissionToolsSheet";
import MissionWorkspace from "../components/MissionWorkspace";
import QueueDashboardSections from "../components/QueueDashboardSections";
import { useMissionControl } from "../hooks/useMissionControl";
import type { AssignMode } from "../hooks/useSlotAssignment";
import type { MissionFormField } from "../hooks/useMissionForm";

/**
 * Appointment & Queue Management, for the roles that run a clinic.
 *
 * Two things live here: the dashboard a health worker watches all day, and the
 * mission scheduling workspace behind Add Mission. The scheduling half is a
 * sheet rather than a section because it is used occasionally — a mission is
 * planned once and worked from for the rest of the day.
 */
export default function MissionControlScreen() {
  const palette = useQueuePalette();
  const insets = useRoleScreenInsets();
  const control = useMissionControl();
  const [missionToolsOpen, setMissionToolsOpen] = useState(false);

  const { assignment, actions, completion, catalogue, createForm, editForm, picker } = control;

  const twoColumn = insets.width >= TWO_COLUMN_WIDTH;
  const asTable = insets.width >= TABLE_WIDTH;
  const fourCards = insets.width >= FOUR_CARD_WIDTH;

  const openAssign = useCallback(
    (appointment: AppointmentRecord, mode: AssignMode) => assignment.openFor(appointment, mode),
    [assignment]
  );

  /** Closing the edit sheet also dismisses the picker it may have opened. */
  const closeEdit = useCallback(() => {
    actions.closeEdit();
    picker.close();
  }, [actions, picker]);

  const activeForm = picker.context === "edit" ? editForm : createForm;

  return (
    <View className="flex-1">
      <RoleScreenBackdrop color={palette.pageBg} insets={insets} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: insets.gutter,
          paddingTop: insets.paddingTop,
          paddingBottom: insets.paddingBottom,
          gap: 16,
        }}
      >
        <View>
          <Text className="text-[22px] font-bold" style={{ color: palette.heading }}>
            Appointment &amp; Queue Management
          </Text>
          <Text className="mt-1 text-[13px]" style={{ color: palette.muted }}>
            {control.scopeDescription}
          </Text>
        </View>

        <QueueStatCards
          overview={control.dashboard.overview}
          loading={control.dashboard.overviewLoading}
          wide={fourCards}
        />

        <QueueDashboardSections
          control={control}
          twoColumn={twoColumn}
          asTable={asTable}
          onAssign={openAssign}
          headerAction={
            control.canManageMissions ? (
              <AddMissionButton palette={palette} onPress={() => setMissionToolsOpen(true)} />
            ) : null
          }
        />
      </ScrollView>

      <CompleteAppointmentModal
        visible={Boolean(completion.target)}
        appointment={completion.target}
        form={completion.targetForm}
        serviceLabel={
          completion.target
            ? control.serviceLabels[completion.target.consultationType] ?? "Appointment"
            : "Appointment"
        }
        onClose={completion.closeComplete}
        onCompleted={(result) => void completion.handleCompleted(result)}
      />

      <MedicalRecordDetails
        visible={Boolean(completion.viewing)}
        record={completion.viewing?.record ?? null}
        form={completion.viewing?.form ?? null}
        onClose={completion.closeRecord}
      />

      <MissionToolsSheet
        visible={missionToolsOpen}
        onClose={() => setMissionToolsOpen(false)}
        isPhone={insets.isPhone}
        palette={palette}
      >
        <MissionWorkspace
          control={control}
          onOpenPicker={(field: MissionFormField) => picker.open("create", field)}
          onAssign={openAssign}
        />
      </MissionToolsSheet>

      <MissionDateTimePicker
        field={picker.field}
        values={activeForm.values}
        onChange={activeForm.setField}
        onDismiss={picker.close}
      />

      <EditMissionModal
        visible={actions.editOpen}
        form={editForm}
        categories={catalogue.categories}
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
    </View>
  );
}
