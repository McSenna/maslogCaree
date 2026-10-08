import { Text, View } from "react-native";

import { Badge, type Column } from "@/components/data-table";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { StaffAppointment } from "@/services/staffDashboardService";

import ServiceBadge from "./ServiceBadge";

export type QueueRow = StaffAppointment & { position: number };

export const slotTime = (iso: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

export const Position = ({ palette, value }: { palette: AdminDashboardPalette; value: number }) => (
  <View className="h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: palette.divider }}>
    <Text className="text-[12.5px] font-bold" style={{ color: palette.muted, fontVariant: ["tabular-nums"] }}>
      {value}
    </Text>
  </View>
);

export const PatientName = ({ palette, row }: { palette: AdminDashboardPalette; row: QueueRow }) => (
  <View className="min-w-0 flex-row items-center gap-2" style={{ alignSelf: "stretch" }}>
    <Text className="min-w-0 shrink text-[13.5px] font-semibold" numberOfLines={1} style={{ color: palette.heading }}>
      {row.patientName}
    </Text>
    {row.isUrgent ? <Badge tone="danger" icon="alert-triangle" label="Urgent" /> : null}
  </View>
);

/** Today's queue, declared once for the header, rows and skeleton. */
export const queueColumns = ({
  palette,
  showService,
  personNoun,
}: {
  palette: AdminDashboardPalette;
  showService: boolean;
  personNoun: string;
}): Column<QueueRow>[] => [
  { key: "position", header: "#", width: 60, render: (row) => <Position palette={palette} value={row.position} /> },
  {
    key: "patient",
    header: personNoun === "resident" ? "Resident" : "Patient",
    flex: 2,
    minWidth: 160,
    render: (row) => <PatientName palette={palette} row={row} />,
  },
  ...(showService
    ? [
        {
          key: "service",
          header: "Service",
          width: 172,
          hideBelow: "lg" as const,
          render: (row: QueueRow) => (
            <ServiceBadge serviceKey={row.consultationType} label={row.serviceLabel} compact />
          ),
        },
      ]
    : []),
  {
    key: "time",
    header: "Slot",
    width: 108,
    render: (row) => (
      <Text
        className="text-[13px] font-medium"
        numberOfLines={1}
        style={{ color: palette.body, fontVariant: ["tabular-nums"] }}
      >
        {slotTime(row.slotStart)}
      </Text>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: 160,
    align: "right",
    render: (row) => <AppointmentStatusBadge status={row.status} />,
  },
];
