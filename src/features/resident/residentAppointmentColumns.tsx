import { Text } from "react-native";

import type { Column } from "@/components/data-table";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { AppointmentRecord } from "@/services/appointments";
import { formatConsultationTypeLabel } from "@/utils/residentDashboard";

export const dateParts = (appointment: AppointmentRecord): { date: string; time: string } => {
  if (!appointment.slotStart) return { date: "Not scheduled yet", time: "" };
  const d = new Date(appointment.slotStart);
  if (Number.isNaN(d.getTime())) return { date: "Not scheduled yet", time: "" };
  return {
    date: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
    time: d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
  };
};

export const residentAppointmentColumns = (palette: AdminDashboardPalette): Column<AppointmentRecord>[] => [
  {
    key: "service",
    header: "Service",
    flex: 1.3,
    minWidth: 150,
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
    minWidth: 140,
    render: (row) => (
      <Text className="text-[13px]" numberOfLines={1} style={{ color: palette.body }}>
        {dateParts(row).date}
      </Text>
    ),
  },
  {
    key: "time",
    header: "Time",
    width: 108,
    hideBelow: "lg",
    render: (row) => (
      <Text className="text-[13px]" numberOfLines={1} style={{ color: palette.body, fontVariant: ["tabular-nums"] }}>
        {dateParts(row).time}
      </Text>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: 160,
    align: "right",
    render: (row) => <AppointmentStatusBadge status={row.status} audience="resident" />,
  },
];
