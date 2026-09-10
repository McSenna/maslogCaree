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
  /** True where there is room for the two content columns to sit side by side. */
  twoColumn: boolean;
  /** True where the appointments list has room to be a table rather than cards. */
  asTable: boolean;
  headerAction: ReactNode;
  onAssign: (appointment: AppointmentRecord, mode: "assign" | "reassign") => void;
};

/**
 * The dashboard's two content columns: the work on the left, the day and the
 * caseload on the right. Below the breakpoint they stack in the same order.
 */
export default function QueueDashboardSections({
  control,
  twoColumn,
  asTable,
  headerAction,
  onAssign,
}: QueueDashboardSectionsProps) {
  const { dashboard, catalogue, actions, completion, serviceLabels, scopeEmptyMessage, todayLabel } =
    control;

  return (
    <View className={`w-full gap-4 ${twoColumn ? "flex-row items-start" : "flex-col"}`}>
      <View className="min-w-0 gap-4" style={twoColumn ? { flex: 2 } : undefined}>
        {/* The queue sits above the tabs because it is the work. An approved
            appointment arrives here on its own — there is no manual step
            between scheduling and being queued — and the only thing left to do
            with it is see the patient. */}
        <ActiveQueuePanel
          appointments={dashboard.queue}
          serviceLabels={serviceLabels}
          loading={dashboard.queueLoading}
          error={dashboard.queueError}
          onRetry={() => void dashboard.loadQueue()}
          // The same rule the API applies: a role completes the services its
          // own queue holds, and every row here is already one of them.
          canComplete
          busyId={completion.busyId}
          onComplete={completion.openComplete}
          emptyMessage="Nobody is waiting to be seen."
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
          // A completed appointment is finished: its row opens the record
          // rather than offering controls the API would refuse.
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
}
