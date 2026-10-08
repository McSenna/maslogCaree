import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import { STATUS_LABELS } from "@/components/appointmentQueue/queueTheme";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import { DataTable } from "@/components/data-table";
import { SegmentedControl } from "@/components/dashboard/kit";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { StaffAppointment } from "@/services/staffDashboardService";
import { byQueueTab, queueTabCounts, type QueueTab } from "../model/staffDashboardModel";
import { PatientName, Position, queueColumns, slotTime, type QueueRow } from "./queueColumns";
import ServiceBadge from "./ServiceBadge";

const VISIBLE_ROWS = 8;

const QueueTable = ({
  palette,
  queue,
  showService,
  personNoun,
  compact,
  onOpenQueue,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  queue: StaffAppointment[];
  showService: boolean;
  personNoun: string;
  compact: boolean;
  onOpenQueue: () => void;
  fill?: boolean;
}) => {
  const [tab, setTab] = useState<QueueTab>("all");

  // Positions come from the full queue, so filtering never renumbers anyone.
  const positioned = useMemo<QueueRow[]>(
    () => queue.map((appointment, index) => ({ ...appointment, position: index + 1 })),
    [queue]
  );
  const counts = useMemo(() => queueTabCounts(queue), [queue]);
  const filtered = useMemo(() => byQueueTab(positioned, tab), [positioned, tab]);
  const rows = filtered.slice(0, VISIBLE_ROWS);
  const hidden = filtered.length - rows.length;

  const columns = queueColumns({ palette, showService, personNoun });

  const tabs = (
    <SegmentedControl
      palette={palette}
      label="Show"
      value={tab}
      onChange={setTab}
      fill={compact}
      options={[
        { value: "all", label: "All", count: counts.all },
        { value: "waiting", label: "Waiting", count: counts.waiting },
        { value: "in_progress", label: "In progress", count: counts.in_progress },
      ]}
    />
  );

  const emptyMessage =
    queue.length === 0
      ? `No one is in today's queue yet.`
      : tab === "waiting"
        ? "No one is waiting right now."
        : `No one is being seen right now.`;

  return (
    <PanelCard
      palette={palette}
      title="Today's queue"
      icon="list"
      subtitle={
        queue.length > 0
          ? `${queue.length} ${queue.length === 1 ? personNoun : `${personNoun}s`} in slot order`
          : "In slot order"
      }
      onViewAll={onOpenQueue}
      viewAllLabel="Open queue"
      headerRight={compact ? undefined : tabs}
      fill={fill}
    >
      {compact ? <View className="mb-3">{tabs}</View> : null}
      <DataTable
        caption="Today's queue"
        surface="plain"
        density="compact"
        layout={compact ? "cards" : "auto"}
        columns={columns}
        data={rows}
        rowKey={(row) => row._id}
        rowLabel={(row) =>
          `Number ${row.position}, ${row.patientName}${row.isUrgent ? ", urgent" : ""}, ${row.serviceLabel}, ${slotTime(row.slotStart)}, ${STATUS_LABELS[row.status]}`
        }
        onRowPress={onOpenQueue}
        rowHint="Opens the appointment queue"
        renderMobileCard={(row) => (
          <View className="flex-row items-center gap-3">
            <Position palette={palette} value={row.position} />
            <View className="min-w-0 flex-1 gap-1">
              <PatientName palette={palette} row={row} />
              <View className="flex-row flex-wrap items-center gap-2">
                {showService ? <ServiceBadge serviceKey={row.consultationType} label={row.serviceLabel} compact /> : null}
                <Text className="text-[12.5px] font-medium" style={{ color: palette.muted, fontVariant: ["tabular-nums"] }}>
                  {slotTime(row.slotStart)}
                </Text>
              </View>
            </View>
            <AppointmentStatusBadge status={row.status} />
          </View>
        )}
        emptyIcon="coffee"
        emptyTitle={emptyMessage}
      />
      {hidden > 0 ? (
        <Pressable
          onPress={onOpenQueue}
          accessibilityRole="link"
          accessibilityLabel={`${hidden} more in the queue. Open the queue`}
          className="mt-1 h-11 flex-row items-center justify-center gap-1.5"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text className="text-[13px] font-semibold" style={{ color: palette.primary }}>
            {hidden} more in the queue
          </Text>
          <Feather name="arrow-right" size={14} color={palette.primary} />
        </Pressable>
      ) : null}
    </PanelCard>
  );
};

export default QueueTable;
