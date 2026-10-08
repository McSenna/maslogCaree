import { Text, View } from "react-native";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import { DataTable, type Column } from "@/components/data-table";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { StaffAppointment } from "@/services/staffDashboardService";
import ServiceBadge from "./ServiceBadge";

const VISIBLE_ROWS = 6;

const parts = (iso: string | null): { day: string; time: string } => {
  if (!iso) return { day: "Not scheduled", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "Not scheduled", time: "" };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day =
    d.toDateString() === tomorrow.toDateString()
      ? "Tomorrow"
      : d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  return { day, time: d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) };
};

const When = ({ palette, iso }: { palette: AdminDashboardPalette; iso: string | null }) => {
  const { day, time } = parts(iso);
  return (
    <View className="items-end">
      <Text className="text-[13px] font-semibold" numberOfLines={1} style={{ color: palette.body }}>
        {day}
      </Text>
      {time ? (
        <Text className="text-[12px]" numberOfLines={1} style={{ color: palette.muted, fontVariant: ["tabular-nums"] }}>
          {time}
        </Text>
      ) : null}
    </View>
  );
};

const UpcomingTable = ({
  palette,
  appointments,
  showService,
  personNoun,
  onOpenQueue,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  appointments: StaffAppointment[];
  showService: boolean;
  personNoun: string;
  onOpenQueue: () => void;
  fill?: boolean;
}) => {
  const rows = appointments.slice(0, VISIBLE_ROWS);

  const columns: Column<StaffAppointment>[] = [
    {
      key: "patient",
      header: personNoun === "resident" ? "Resident" : "Patient",
      flex: 1,
      minWidth: 150,
      render: (row) => (
        <View className="min-w-0 gap-1" style={{ alignSelf: "stretch" }}>
          <Text className="text-[13.5px] font-semibold" numberOfLines={1} style={{ color: palette.heading }}>
            {row.patientName}
          </Text>
          {showService ? <ServiceBadge serviceKey={row.consultationType} label={row.serviceLabel} compact /> : null}
        </View>
      ),
    },
    { key: "when", header: "When", width: 144, align: "right", render: (row) => <When palette={palette} iso={row.slotStart} /> },
  ];

  return (
    <PanelCard
      palette={palette}
      title="Coming up"
      icon="calendar"
      subtitle="Booked after today"
      onViewAll={onOpenQueue}
      viewAllLabel="Schedule"
      fill={fill}
    >
      <DataTable
        caption="Coming up"
        surface="plain"
        density="compact"
        columns={columns}
        data={rows}
        rowKey={(row) => row._id}
        rowLabel={(row) => {
          const { day, time } = parts(row.slotStart);
          return `${row.patientName}, ${row.serviceLabel}, ${day} ${time}`;
        }}
        emptyIcon="calendar"
        emptyTitle="Nothing booked after today yet."
      />
    </PanelCard>
  );
};

export default UpcomingTable;
