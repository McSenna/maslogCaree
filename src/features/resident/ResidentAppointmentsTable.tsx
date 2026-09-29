import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import { DataTable, SegmentedControl, type TableColumn } from "@/components/dashboard/kit";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { appointmentsFor, tabOf, type AppointmentTab } from "@/screens/resident/dashboard/appointmentTabs";
import type { AppointmentRecord } from "@/services/appointments";
import { formatConsultationTypeLabel } from "@/utils/residentDashboard";

const VISIBLE_ROWS = 5;

const dateParts = (appointment: AppointmentRecord): { date: string; time: string } => {
  if (!appointment.slotStart) return { date: "Not scheduled yet", time: "" };
  const d = new Date(appointment.slotStart);
  if (Number.isNaN(d.getTime())) return { date: "Not scheduled yet", time: "" };
  return {
    date: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
    time: d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
  };
};

const ResidentAppointmentsTable = ({
  palette,
  appointments,
  compact,
  onOpen,
  onViewAll,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  appointments: AppointmentRecord[];
  compact: boolean;
  onOpen: (appointment: AppointmentRecord) => void;
  onViewAll: () => void;
  fill?: boolean;
}) => {
  const [tab, setTab] = useState<AppointmentTab>("upcoming");

  const counts = useMemo(() => {
    const now = new Date();
    const upcoming = appointments.filter((appointment) => tabOf(appointment, now) === "upcoming").length;
    return { upcoming, past: appointments.length - upcoming };
  }, [appointments]);
  const rows = useMemo(() => appointmentsFor(appointments, tab).slice(0, VISIBLE_ROWS), [appointments, tab]);

  const columns: TableColumn<AppointmentRecord>[] = [
    {
      key: "service",
      header: "Service",
      flex: 1.3,
      render: (row) => (
        <Text className="text-[13.5px] font-semibold" numberOfLines={1} style={{ color: palette.heading }}>
          {formatConsultationTypeLabel(row.consultationType)}
        </Text>
      ),
    },
    {
      key: "date",
      header: "Date",
      flex: 1,
      render: (row) => (
        <Text className="text-[13px]" numberOfLines={1} style={{ color: palette.body }}>
          {dateParts(row).date}
        </Text>
      ),
    },
    {
      key: "time",
      header: "Time",
      width: 76,
      minTableWidth: 480,
      render: (row) => (
        <Text className="text-[13px]" numberOfLines={1} style={{ color: palette.body, fontVariant: ["tabular-nums"] }}>
          {dateParts(row).time}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: 128,
      align: "right",
      render: (row) => <AppointmentStatusBadge status={row.status} audience="resident" />,
    },
  ];

  const tabs = (
    <SegmentedControl
      palette={palette}
      label="Show appointments"
      value={tab}
      onChange={setTab}
      fill={compact}
      options={[
        { value: "upcoming", label: "Upcoming", count: counts.upcoming },
        { value: "past", label: "Past", count: counts.past },
      ]}
    />
  );

  return (
    <PanelCard
      palette={palette}
      title="My appointments"
      icon="calendar"
      subtitle={tab === "upcoming" ? "Soonest first" : "Most recent first"}
      onViewAll={onViewAll}
      viewAllLabel="All"
      headerRight={compact ? undefined : tabs}
      fill={fill}
    >
      {compact ? <View className="mb-3">{tabs}</View> : null}
      <DataTable
        palette={palette}
        caption="My appointments"
        columns={columns}
        rows={rows}
        rowKey={(row) => row._id}
        rowLabel={(row) => {
          const { date, time } = dateParts(row);
          return `${formatConsultationTypeLabel(row.consultationType)}, ${date}${time ? ` at ${time}` : ""}, ${row.status}`;
        }}
        onRowPress={onOpen}
        rowHint="Opens your appointments"
        stacked={compact}
        renderStacked={(row) => {
          const { date, time } = dateParts(row);
          return (
            <View className="flex-row items-center gap-3">
              <View className="min-w-0 flex-1 gap-0.5">
                <Text className="text-[14px] font-semibold" numberOfLines={1} style={{ color: palette.heading }}>
                  {formatConsultationTypeLabel(row.consultationType)}
                </Text>
                <Text className="text-[12.5px]" numberOfLines={1} style={{ color: palette.muted }}>
                  {time ? `${date}, ${time}` : date}
                </Text>
              </View>
              <AppointmentStatusBadge status={row.status} audience="resident" />
            </View>
          );
        }}
        emptyIcon="calendar"
        emptyMessage={tab === "upcoming" ? "No upcoming appointments. Book one when you need a visit." : "No past appointments yet."}
      />
    </PanelCard>
  );
};

export default ResidentAppointmentsTable;
