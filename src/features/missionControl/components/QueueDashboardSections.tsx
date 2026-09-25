import type { ReactNode } from "react";
import { View } from "react-native";
import ActiveQueuePanel from "@/components/appointmentQueue/ActiveQueuePanel";
import AppointmentsPanel from "@/components/appointmentQueue/AppointmentsPanel";
import ServiceBreakdownPanel from "@/components/appointmentQueue/ServiceBreakdownPanel";
import TodaySchedulePanel from "@/components/appointmentQueue/TodaySchedulePanel";
import type { AppointmentRecord } from "@/services/appointments";
import type { MissionControl } from "../hooks/useMissionControl";

type QueueDashboardSectionsProps = {
  control: MissionControl;
  twoColumn: boolean;
  asTable: boolean;
  headerAction: ReactNode;
  onAssign: (appointment: AppointmentRecord, mode: "assign" | "reassign") => void;
};

const QueueDashboardSections = ({
  control,
  twoColumn,
  asTable,
  headerAction,
  onAssign,
}: QueueDashboardSectionsProps) => {
  const { dashboard, catalogue, actions, completion, serviceLabels, scopeEmptyMessage, todayLabel } =
    control;

  return (
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
          emptyTitle="No patients waiting"
          emptyMessage="Approved appointments for today will appear here in queue order."
        />

        <AppointmentsPanel
          appointments={dashboard.statusList}
          statusCounts={dashboard.overview?.statusCounts ?? {}}
          activeStatus={dashboard.activeStatus}
          onStatusChange={dashboard.setActiveStatus}
          serviceLabels={serviceLabels}
          headerAction={headerAction}
          onApprove={(appointment) => onAssign(appointment, "assign")}
          onMore={(appointment) =>
            onAssign(appointment, appointment.status === "pending" ? "assign" : "reassign")
          }
          busyId={actions.saving ? control.assignment.target?._id ?? null : null}
          canAct={control.canAct && dashboard.activeStatus !== "completed"}
          onRowPress={
            dashboard.activeStatus === "completed"
              ? (appointment) => void completion.openRecord(appointment)
              : undefined
          }
          loading={dashboard.listLoading}
          error={dashboard.listError}
          onRetry={() => void catalogue.refreshLists()}
          emptyMessage={scopeEmptyMessage}
          asTable={asTable}
        />
      </View>

      <View className="min-w-0 gap-4" style={twoColumn ? { flex: 1 } : undefined}>
        <TodaySchedulePanel
          schedule={dashboard.overview?.schedule ?? []}
          serviceLabels={serviceLabels}
          loading={dashboard.overviewLoading}
          emptyMessage={scopeEmptyMessage}
          dateLabel={todayLabel}
        />
        <ServiceBreakdownPanel
          rows={dashboard.overview?.breakdown ?? []}
          loading={dashboard.overviewLoading}
        />
      </View>
    </View>
  );
};

export default QueueDashboardSections;
