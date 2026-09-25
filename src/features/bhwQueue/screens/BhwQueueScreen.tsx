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
import { useAuth } from "@/contexts/AuthContext";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import QueueRefreshButton from "../components/QueueRefreshButton";
import { useBhwQueue } from "../hooks/useBhwQueue";

const BhwQueueScreen = () => {
  const palette = useQueuePalette();
  const insets = useRoleScreenInsets();
  const { user } = useAuth();
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

        <View className={`w-full gap-4 ${twoColumn ? "flex-row items-start" : "flex-col"}`}>
          <View className="min-w-0 gap-4" style={twoColumn ? { flex: 2 } : undefined}>
            <ActiveQueuePanel
              appointments={dashboard.queue}
              serviceLabels={serviceLabels}
              loading={dashboard.queueLoading}
              error={dashboard.queueError}
              onRetry={() => void dashboard.loadQueue()}
              canComplete
              busyId={completion.busyId}
              onComplete={completion.openComplete}
              emptyTitle="No residents currently waiting"
              emptyMessage={`Residents will appear here after entering the ${serviceLabel} queue.`}
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
              canAct={false}
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
        formError={completion.formsError}
        serviceLabel={serviceLabel}
        providerName={user?.name ?? null}
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
    </View>
  );
};

export default BhwQueueScreen;
