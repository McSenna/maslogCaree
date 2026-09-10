import { ScrollView, Text, View } from "react-native";
import ActiveQueuePanel from "@/components/appointmentQueue/ActiveQueuePanel";
import AppointmentsPanel from "@/components/appointmentQueue/AppointmentsPanel";
import QueueStatCards from "@/components/appointmentQueue/QueueStatCards";
import ServiceBreakdownPanel from "@/components/appointmentQueue/ServiceBreakdownPanel";
import TodaySchedulePanel from "@/components/appointmentQueue/TodaySchedulePanel";
import {
  FOUR_CARD_WIDTH,
  TABLE_WIDTH,
  TWO_COLUMN_WIDTH,
  useQueuePalette,
} from "@/components/appointmentQueue/queueTheme";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import CompleteAppointmentModal from "@/components/medicalRecord/CompleteAppointmentModal";
import MedicalRecordDetails from "@/components/medicalRecord/MedicalRecordDetails";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import QueueRefreshButton from "../components/QueueRefreshButton";
import { useBhwQueue } from "../hooks/useBhwQueue";

/**
 * The BHW's Appointment & Queue screen — BP Checking, and nothing else.
 *
 * Split from the shared mission-control screen rather than gated inside it.
 * That screen is built around a mission schedule: it opens by reading
 * `GET /mission-schedule`, which the API restricts to doctor, admin and
 * midwife, so a BHW landing on it was met with a 403 alert before the page had
 * drawn anything. Missions are not a BHW's instrument, so the fix is a screen
 * that never asks for one — not a flag that hides half of somebody else's.
 *
 * Read-only, deliberately. Scheduling, reassigning and declining act on
 * mission-schedule slots and stay with the roles that manage them, so no row
 * carries a control the API would refuse.
 */
export default function BhwQueueScreen() {
  const palette = useQueuePalette();
  // The same insets the other role pages use, so this page lines up under the
  // header and against the sidebar rather than sitting at its own.
  const insets = useRoleScreenInsets();
  const queue = useBhwQueue();
  const { dashboard, completion, serviceLabel, serviceLabels } = queue;

  const twoColumn = insets.width >= TWO_COLUMN_WIDTH;
  const asTable = insets.width >= TABLE_WIDTH;
  const fourCards = insets.width >= FOUR_CARD_WIDTH;

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
            Appointment &amp; Queue
          </Text>
          <Text className="mt-1 text-[13px]" style={{ color: palette.muted }}>
            {queue.scopeDescription}
          </Text>
        </View>

        <QueueStatCards
          overview={dashboard.overview}
          loading={dashboard.overviewLoading}
          wide={fourCards}
        />

        {/* Two columns where there is room: the work on the left, the day and
            the caseload on the right. Below that they stack in the same order. */}
        <View className={`w-full gap-4 ${twoColumn ? "flex-row items-start" : "flex-col"}`}>
          <View className="min-w-0 gap-4" style={twoColumn ? { flex: 2 } : undefined}>
            {/* The queue sits above the tabs because it is the work: an
                approved appointment arrives here on its own and the only thing
                left to do with it is see the patient. */}
            <ActiveQueuePanel
              appointments={dashboard.queue}
              serviceLabels={serviceLabels}
              loading={dashboard.queueLoading}
              error={dashboard.queueError}
              onRetry={() => void dashboard.loadQueue()}
              canComplete
              busyId={completion.busyId}
              onComplete={completion.openComplete}
              emptyMessage={`No ${serviceLabel} patients waiting.`}
            />

            <AppointmentsPanel
              appointments={dashboard.statusList}
              statusCounts={dashboard.overview?.statusCounts ?? {}}
              activeStatus={dashboard.activeStatus}
              onStatusChange={dashboard.setActiveStatus}
              serviceLabels={serviceLabels}
              headerAction={
                <QueueRefreshButton
                  onPress={queue.refreshAll}
                  busy={queue.busy}
                  accessibilityLabel={`Refresh the ${serviceLabel} queue`}
                />
              }
              busyId={null}
              // Scheduling and declining belong to the roles that manage the
              // mission a slot comes from, so no row here offers them. A BHW
              // acts on their queue through Complete, in the panel above.
              canAct={false}
              // A completed row opens its record instead.
              onRowPress={
                dashboard.activeStatus === "completed"
                  ? (appointment) => void completion.openRecord(appointment)
                  : undefined
              }
              loading={dashboard.listLoading}
              error={dashboard.listError}
              onRetry={() => void dashboard.loadStatusList(dashboard.activeStatus)}
              emptyMessage={queue.emptyMessage}
              asTable={asTable}
            />
          </View>

          <View className="min-w-0 gap-4" style={twoColumn ? { flex: 1 } : undefined}>
            <TodaySchedulePanel
              schedule={dashboard.overview?.schedule ?? []}
              serviceLabels={serviceLabels}
              loading={dashboard.overviewLoading}
              emptyMessage={queue.emptyMessage}
              dateLabel={queue.todayLabel}
            />
            <ServiceBreakdownPanel
              rows={dashboard.overview?.breakdown ?? []}
              loading={dashboard.overviewLoading}
            />
          </View>
        </View>
      </ScrollView>

      <CompleteAppointmentModal
        visible={Boolean(completion.target)}
        appointment={completion.target}
        form={completion.targetForm}
        serviceLabel={serviceLabel}
        onClose={completion.closeComplete}
        onCompleted={(result) => void completion.handleCompleted(result)}
      />

      <MedicalRecordDetails
        visible={Boolean(completion.viewing)}
        record={completion.viewing?.record ?? null}
        form={completion.viewing?.form ?? null}
        onClose={completion.closeRecord}
      />
    </View>
  );
}
